/**
 * @type {Function}
 */
import modelExtend from 'dva-model-extend';
import { history } from 'umi';

import { commonModel } from '@/models/common.model';
import i18n from '@/utils/i18n';
import { fromForm } from '@/utils/object';
import request from '@/utils/request';
import { generateKey } from '@/services/common.service';
import { getWidgets } from '@/services/widget.service';

import {
  raiseConditionMsg,
  raisePermissionMsg,
  successDeleteMsg,
  successSaveMsg
} from '@/utils/message';

import {
  destroyWebsite,
  getAssignedWidgets,
  getWebsite,
  getWebsites,
  saveWebsite,
  saveWebsiteWidgets,
  updateWebsite
} from '@/services/website.service';

const DEFAULT_STATE = {
  websites: [],
  widgets: [],
  assignedWidgets: [],
  selectedWebsite: null,
  websiteKey: null,
  userKey: null
};

/**
 * @export
 * @default
 */
export default modelExtend(commonModel, {
  namespace: 'websiteModel',
  state: { ...DEFAULT_STATE },

  effects: {

    * resetState({ payload }, { put }) {
      yield put({
        type: 'cleanForm',
        payload: { DEFAULT_STATE }
      });
    },

    * websitesQuery({ payload }, { put, call, select }) {
      let { token } = yield select(state => state.authModel);
      const { userKey } = payload;

      const res = yield call(getWebsites, { userKey, token });

      if (res?.data) {
        const { websites, error } = res?.data;

        yield put({
          type: 'updateState',
          payload: {
            websites,
            userKey,
            touched: false,
            selectedWebsite: null
          }
        });
      }
    },

    * websitesHandleNew({ payload }, { put, select }) {
      let { ability } = yield select(state => state.authModel);

      if (ability.can('create', 'websites')) {
        return yield put({
          type: 'updateState',
          payload: { ...payload }
        });
      }

      yield put({
        type: 'raiseCondition',
        payload: {
          message: raisePermissionMsg,
          type: 403,
          redirect: true
        }
      });
    },

    * prepareToEdit({ payload }, { put, call, select }) {
      let { token } = yield select(state => state.authModel);
      const { userKey, websiteKey } = payload;

      const res = yield call(getWebsite, { userKey, websiteKey, token });

      if (res?.data) {
        const { website, user, error } = res.data;
        if (website) {

          yield put({
            type: 'updateState',
            payload: {
              websiteKey,
              userKey,
              touched: false,
              selectedWebsite: website,
              tags: JSON.parse(website?.tags || '[]'),
              previewUrl: website?.picture.url,
              isEdit: website?.key !== 'new'
            }
          });

          yield put({
            type: 'toForm',
            payload: {
              model: 'websiteModel',
              form: {
                metadata: {
                  createdAt: website?.created_at,
                  updatedAt: website?.updated_at,
                  createdBy: {
                    key: user?.key,
                    displayName: user?.name
                  }
                },
                ...website,
                ...{ entityKey: websiteKey }
              }
            }
          });

          return history.push(`/accounts/${userKey}/websites/${websiteKey}`);
        }

        yield put({
          type: 'raiseCondition',
          payload: {
            message: raiseConditionMsg(i18n.t('instance:website')),
            type: 404,
            redirect: true
          }
        });
      }
    },

    * websitesHandleEdit({ payload }, { put, select }) {
      const { ability } = yield select(state => state.authModel);
      const { selectedWebsite } = yield select(state => state.websiteModel);
      const { websiteKey } = payload;

      if (websiteKey === 'new') {
        // Do nothing.
        return yield put({ type: 'websitesHandleNew', payload });

      } else if (ability.can('read', 'websites')) {

        yield put({ type: 'updateState', payload });

        return selectedWebsite ?
          false :
          (yield put({ type: 'prepareToEdit', payload }));
      }

      yield put({
        type: 'raiseCondition',
        payload: {
          message: raisePermissionMsg,
          type: 403,
          redirect: true
        }
      });
    },

    * prepareToSave({ payload }, { put, select, call }) {
      const { isEdit } = yield select((state) => state.websiteModel);

      if (!isEdit) {
        payload.entityKey = yield call(generateKey);
      }

      yield put({
        type: 'save',
        payload: { ...payload, model: 'websiteModel' }
      });
    },

    * save({ payload }, { put, call, select }) {
      const { ability, token } = yield select(state => state.authModel);
      const { fileList, isEdit, tags, removeFile, websiteKey, userKey } = yield select(state => state.websiteModel);

      if (ability.can(isEdit ? 'update' : 'create', 'websites')) {
        const save = yield call(isEdit ? updateWebsite : saveWebsite, {
          entityForm: payload,
          removeFile,
          fileList,
          tags,
          token,
          websiteKey,
          userKey
        });

        if (request.isSuccess(save?.status) && !save?.data?.errors) {
          successSaveMsg(isEdit, i18n.t('instance:website'));

          yield put({
            type: 'prepareToEdit',
            payload: {
              userKey,
              websiteKey: save?.data?.location?.key
            }
          });

          yield put({
            type: 'updateState',
            payload: { touched: false }
          });
        }
      }
    },

    * websitesHandleDelete({ payload }, { put, call, select }) {
      const { ability, token } = yield select(state => state.authModel);
      const { isEdit, userKey } = yield select(state => state.websiteModel);

      if (ability.can('delete', 'websites')) {
        const destroy = yield call(destroyWebsite, {
          websiteKey: payload.websiteKey,
          userKey,
          token
        });

        if (request.isSuccess((destroy || {}).status)) {
          successDeleteMsg(i18n.t('instance:website'));
          isEdit ?
            history.push(`/accounts/${userKey}/websites`) :
            (yield put({ type: 'websitesQuery', payload: { userKey } }));
        }
      }
    },

    * websiteWidgetsQuery({ payload }, { put, call, select }) {
      const { ability, token } = yield select(state => state.authModel);
      const { userKey, websiteKey } = payload;

      if (ability.can('assign', 'websiteWidgets')) {

        const res = yield call(getAssignedWidgets, {
          userKey,
          websiteKey,
          token
        });

        const allWidgets = yield call(getWidgets, { userKey, token });

        if (res?.data && allWidgets?.data) {
          const { assigned_widgets = [], website } = res.data;

          yield put({
            type: 'toForm',
            payload: {
              model: 'websiteModel',
              form: {
                entityKey: website?.key,
                name: website?.name
              }
            }
          });

          return yield put({
            type: 'updateState',
            payload: {
              assignedWidgets: [...assigned_widgets],
              widgets: allWidgets.data?.widgets
            }
          });
        }

        yield put({
          type: 'raiseCondition',
          payload: {
            message: raiseConditionMsg(i18n.t('instance:website')),
            type: 404,
            redirect: true
          }
        });
      }
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
