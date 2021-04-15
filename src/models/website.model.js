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
import { getWidgets } from '@/services/widget.service';

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


/**
 * @export
 * @default
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

        yield put({
          type: 'updateState',
          payload: { websites }
        });
      }
    },

    * websitesHandleNew({ payload }, { put, select }) {
      let { websites = [] } = yield select((state) => state.websiteModel);

      if (!websites.length) {
        yield put({ type: 'websitesQuery' });
      }

      yield put({
        type: 'updateState',
        payload: {
          touched: false,
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
                touched: false,
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
        yield put({ type: 'websitesQuery' });
      }

      const { params } = payload;
      const { website } = params;

      yield put({ type: 'cleanForm' });

      yield put({
        type: 'validateWebsite',
        payload: { websiteKey: website }
      });
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
      const { fileList, isEdit, tags, removeFile } = yield select(state => state.websiteModel);
      const { ability, token } = yield select(state => state.authModel);

      if (ability.can(isEdit ? 'update' : 'create', 'websites')) {
        const save = yield call(isEdit ? updateWebsite : saveWebsite, {
          entityForm: payload,
          removeFile,
          fileList,
          tags,
          token
        });

        if (request.isSuccess((save || {}).status)) {
          successSaveMsg(isEdit, i18n.t('instance:website'));

          yield put({
            type: 'validateWebsite',
            payload: { websiteKey: save?.data?.location?.key }
          });

          yield put({
            type: 'updateState',
            payload: { touched: false }
          });
        }
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
