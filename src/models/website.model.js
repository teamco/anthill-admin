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
 * @constant
 * @type {string}
 */
const raiseConditionMsg = i18n.t('error:notFound', { instance: i18n.t('instance:website') });

/**
 * @constant
 * @type {string}
 */
const raisePermissionMsg = i18n.t('error:noPermissions');

/**
 * @export
 * @default
 */
export default dvaModelExtend(commonModel, {
  namespace: 'websiteModel',
  state: {
    websites: [],
    widgets: [],
    assignedWidgets: [],
    selectedWebsite: null,
    websiteKey: null,
    userKey: null
  },

  effects: {

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
            selectedWebsite: null
          }
        });
      }

      yield put({ type: 'cleanForm' });
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
        const { website, error } = res.data;
        if (website) {
          yield put({
            type: 'updateState',
            payload: {
              websiteKey,
              userKey,
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
                ...website,
                ...{ entityKey: websiteKey }
              }
            }
          });

          history.push(`/accounts/${userKey}/websites/${websiteKey}`);
        }
      }
    },

    * websitesHandleEdit({ payload }, { put, select }) {
      const { ability } = yield select(state => state.authModel);
      const { selectedWebsite } = yield select(state => state.websiteModel);
      const { websiteKey } = payload;

      yield put({ type: 'cleanForm' });

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
