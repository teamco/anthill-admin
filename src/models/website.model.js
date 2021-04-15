/**
 * @type {Function}
 */
import dvaModelExtend from 'dva-model-extend';
import { history } from 'umi';

import { commonModel } from '@/models/common.model';
import i18n from '@/utils/i18n';
import { fromForm } from '@/utils/object';
import request from '@/utils/request';
import { generateKey } from '@/services/common.service';

import { successDeleteMsg, successSaveMsg } from '@/utils/message';

import {
  destroyWebsite,
  getAssignedWidgets,
  getWebsite,
  getWebsites,
  saveWebsite,
  saveWebsiteWidgets,
  updateWebsite
} from '@/services/website.service';
import { getWidgets } from '@/services/widget.service';
import { getStoredToken } from '@/services/auth.service';

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'websiteModel',
  state: {
    websites: [],
    widgets: [],
    assignedWidgets: []
  },
  effects: {
    * websitesQuery({ payload }, { put, call, select }) {
      let { token } = yield select(state => state.authModel);

      const res = yield call(getWebsites, { token });

      if (res?.data) {
        const { websites, error } = res?.data;

        if (payload?.global) {
          yield put({
            type: 'appModel/storeForm',
            payload: {
              form: null,
              model: 'websiteModel'
            }
          });

          yield put({
            type: 'appModel/activeModel',
            payload: {
              isEdit: false,
              model: 'websiteModel',
              count: websites?.length,
              title: i18n.t('model:list', { instance: '$t(menu:websites)' })
            }
          });
        }

        yield put({
          type: 'updateState',
          payload: { websites }
        });
      }
    },

    * websitesHandleNew({ payload }, { put, select }) {
      let { websites = [] } = yield select((state) => state.websiteModel);

      if (!websites.length) {
        yield put({
          type: 'websitesQuery',
          payload: { global: false }
        });
      }

      yield put({
        type: 'updateState',
        payload: {
          entityForm: [],
          fileList: [],
          previewUrl: null,
          isEdit: payload.isEdit
        }
      });

      yield put({
        type: 'appModel/activeModel',
        payload: {
          isEdit: payload.isEdit,
          model: 'websiteModel',
          title: i18n.t('model:create', { instance: '$t(instance:website)' })
        }
      });
    },

    * prepareToEdit({ payload }, { put, call, select }) {
      let { token } = yield select(state => state.authModel);
      const res = yield call(getWebsite, { key: payload.key, token });

      if (res?.data) {
        const { website, error } = res.data;
        if (website) {
          history.replace(`/websites/${website?.key}`);
        }
      }
    },

    * validateWebsite({ payload }, { call, put, select }) {
      const { ability, token } = yield select(state => state.authModel);
      const { websiteKey } = payload;

      if (websiteKey === 'new') {
        // Do nothing.
      } else if (ability.can('read', 'websites')) {

        const res = yield call(getWebsite, { key: websiteKey, token });

        if (res?.data) {
          const { website, error } = res.data;
          if (website) {

            yield put({
              type: 'updateState',
              payload: {
                fileList: [],
                tags: JSON.parse(website?.tags || '[]'),
                previewUrl: website?.picture.url,
                isEdit: websiteKey !== 'new'
              }
            });

            return yield put({
              type: 'toForm',
              payload: {
                model: 'websiteModel',
                form: {
                  ...website,
                  ...{ entityKey: websiteKey }
                }
              }
            });
          }
        }

        yield put({
          type: 'raiseCondition',
          payload: {
            message: i18n.t('error:notFound', { entity: 'Website' }),
            key: 'website'
          }
        });
      }
    },

    * websitesHandleEdit({ payload }, { put, select }) {
      let { websites = [] } = yield select((state) => state.websiteModel);

      if (!websites.length) {
        yield put({
          type: 'websitesQuery',
          payload: { global: false }
        });
      }

      const { params } = payload;
      const { website } = params;

      yield put({ type: 'cleanForm' });

      yield put({
        type: 'validateWebsite',
        payload: { websiteKey: website }
      });


      // const website = yield call(getWebsite, { key: payload.key });

      // const {
      //   key,
      //   name,
      //   description,
      //   picture = {},
      //   tags,
      //   created_at,
      //   updated_at
      // } = website.data;

      // yield put({
      //   type: 'updateState',
      //   payload: {
      //     fileList: [],
      //     tags: JSON.parse(tags || '[]'),
      //     isEdit: payload.isEdit,
      //     previewUrl: picture.url,
      //     timestamp: {
      //       created_at,
      //       updated_at
      //     }
      //   }
      // });
      //
      // yield put({
      //   type: 'toForm',
      //   payload: {
      //     model: 'websiteModel',
      //     entityKey: key,
      //     name,
      //     description
      //   }
      // });
      //
      // yield put({
      //   type: 'appModel/activeModel',
      //   payload: {
      //     model: 'websiteModel',
      //     isEdit: payload.isEdit,
      //     timestamp: {
      //       created_at,
      //       updated_at
      //     },
      //     instance: i18n.t('instance:website'),
      //     title: i18n.t('model:edit', { instance: '$t(instance:website)' })
      //   }
      // });
      //
      // yield take('appModel/activeModel/@@end');
    },

    * prepareToSave({ payload }, { put, select, call }) {
      const { isEdit } = yield select((state) => state.websiteModel);

      const _payload = {
        ...payload,
        model: 'websiteModel'
      };

      if (!isEdit) {
        _payload.entityKey = yield call(generateKey);
      }

      yield put({
        type: 'save',
        payload: _payload
      });
    },

    * save({ payload }, { put, call, select }) {
      const { fileList, isEdit, tags } = yield select(
        (state) => state.websiteModel
      );

      const save = yield call(isEdit ? updateWebsite : saveWebsite, {
        entityForm: payload,
        fileList,
        tags
      });

      if (request.isSuccess((save || {}).status)) {
        successSaveMsg(isEdit, i18n.t('instance:website'));

        yield put({
          type: 'prepareToEdit',
          payload: {
            key: save.data.key
          }
        });
      }
    },

    * handleDelete({ payload }, { put, call, select }) {
      const { entityForm, isEdit } = yield select(
        (state) => state.websiteModel
      );
      const entityKey = isEdit
        ? fromForm(entityForm).entityKey
        : payload.entityKey;

      const destroy = yield call(destroyWebsite, { entityKey });

      if (request.isSuccess((destroy || {}).status)) {
        successDeleteMsg(i18n.t('instance:website'));
        isEdit && (yield put(history.replace(`/websites`)));
      }
    },

    * websiteWidgetsQuery({ payload }, { put, call }) {
      const { data } = yield call(getAssignedWidgets, { key: payload.key });
      const allWidgets = yield call(getWidgets);

      const { website, widgets } = data.assigned;

      yield put({
        type: 'toForm',
        payload: {
          model: 'websiteModel',
          entityKey: website.key,
          name: website.name
        }
      });

      yield put({
        type: 'appModel/activeModel',
        payload: {
          model: 'websiteModel',
          title: i18n.t('website:assignWidgetsTo', { instance: website.name })
        }
      });

      yield put({
        type: 'updateState',
        payload: {
          assignedWidgets: [...widgets],
          widgets: allWidgets.data
        }
      });
    },

    * assignWidget({ payload }, { put, select }) {
      const { assignedWidgets } = yield select((state) => state.websiteModel);
      const { widget } = payload;

      if (assignedWidgets.find((assigned) => assigned.key === widget.key)) {
        return false;
      }

      assignedWidgets.push(widget);

      yield put({
        type: 'updateState',
        payload: {
          assignedWidgets: [...assignedWidgets]
        }
      });
    },

    * unassignWidget({ payload }, { put, select }) {
      const { assignedWidgets } = yield select((state) => state.websiteModel);
      const { widget } = payload;

      const _filtered = assignedWidgets.filter(
        (assigned) => assigned.key !== widget.key
      );

      yield put({
        type: 'updateState',
        payload: {
          assignedWidgets: [..._filtered]
        }
      });
    },

    * saveAssignedWidgets(_, { put, select, call }) {
      const { assignedWidgets, entityForm } = yield select(
        (state) => state.websiteModel
      );

      const widget_ids = assignedWidgets.map((widget) => widget.key);
      const save = yield call(saveWebsiteWidgets, {
        entityForm: fromForm(entityForm),
        widget_ids
      });

      if (request.isSuccess((save || {}).status)) {
        successSaveMsg(false, i18n.t('website:assignWidgets'));

        yield put({
          type: 'updateState',
          payload: {
            assignedWidgets: [...save.data.assigned.widgets]
          }
        });
      }
    }
  },
  reducers: {}
});
