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

import { raiseConditionMsg, raisePermissionMsg, successDeleteMsg, successSaveMsg } from '@/utils/message';

import {
  destroyWidget,
  getWidget,
  getWidgets,
  saveWidget,
  updateWidget
} from '@/services/widget.service';

const DEFAULT_STATE = {
  widgets: [],
  selectedWidget: null,
  contentKey: generateKey(),
  contentKey1: generateKey()
};

/**
 * @export
 * @default
 */
export default modelExtend(commonModel, {
  namespace: 'widgetModel',
  state: { ...DEFAULT_STATE },

  effects: {

    * resetState({ payload }, { put }) {
      yield put({
        type: 'cleanForm',
        payload: { DEFAULT_STATE }
      });
    },

    * widgetsQuery({ payload }, { put, call, select }) {
      let { token } = yield select(state => state.authModel);
      const { userKey } = payload;

      const res = yield call(getWidgets, { userKey, token });

      if (res?.data) {
        const { widgets, error } = res?.data;

        yield put({
          type: 'updateState',
          payload: {
            selectedWidget: null,
            widgets,
            userKey
          }
        });
      }
    },

    * widgetsHandleNew({ payload }, { put, select, take }) {
      let { widgets = [] } = yield select((state) => state.widgetModel);
      if (!widgets.length) {
        yield put({
          type: 'query',
          payload: { global: false }
        });
      }

      yield put({
        type: 'updateState',
        payload: {
          entityForm: [],
          fileList: [],
          tags: [],
          previewUrl: null,
          isEdit: payload.isEdit
        }
      });

      yield put({
        type: 'appModel/activeModel',
        payload: {
          isEdit: payload.isEdit,
          model: 'widgetModel',
          title: i18n.t('model:create', { instance: '$t(instance:widget)' })
        }
      });

      yield take('appModel/activeModel/@@end');
    },

    * prepareToEdit({ payload }, { put, call, select }) {
      let { token } = yield select(state => state.authModel);
      const { userKey, widgetKey } = payload;

      const res = yield call(getWidget, { userKey, widgetKey, token });

      if (res?.data) {
        const { widget, error } = res.data;
        if (widget) {

          yield put({
            type: 'updateState',
            payload: {
              widgetKey,
              userKey,
              selectedWidget: widget,
              tags: JSON.parse(widget?.tags || '[]'),
              previewUrl: widget?.picture.url,
              isEdit: widget?.key !== 'new'
            }
          });

          yield put({
            type: 'toForm',
            payload: {
              model: 'widgetModel',
              form: {
                ...widget,
                ...{ entityKey: widgetKey }
              }
            }
          });

          return history.push(`/accounts/${userKey}/widgets/${widgetKey}`);
        }

        yield put({
          type: 'raiseCondition',
          payload: {
            message: raiseConditionMsg(i18n.t('instance:widget')),
            type: 404,
            redirect: true
          }
        });
      }
    },

    * widgetHandleEdit({ payload }, { put, select }) {
      const { ability } = yield select(state => state.authModel);
      const { selectedWidget } = yield select(state => state.widgetModel);
      const { widgetKey } = payload;

      if (widgetKey === 'new') {
        // Do nothing.
        return yield put({ type: 'widgetHandleNew', payload });

      } else if (ability.can('read', 'widgets')) {

        yield put({ type: 'updateState', payload });

        return selectedWidget ?
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

    //
    // * widgetsHandleEdit({ payload }, { put, call, select, take }) {
    //   let { widgets = [] } = yield select((state) => state.widgetModel);
    //   if (!widgets.length) {
    //     yield put({
    //       type: 'query',
    //       payload: { global: false }
    //     });
    //   }
    //
    //   const widget = yield call(getWidget, { key: payload.key });
    //
    //   const {
    //     key,
    //     name,
    //     description,
    //     picture = {},
    //     width,
    //     height,
    //     tags,
    //     created_at,
    //     updated_at
    //   } = (widget || {}).data || {};
    //
    //   yield put({
    //     type: 'updateState',
    //     payload: {
    //       fileList: [],
    //       tags: JSON.parse(tags || '[]'),
    //       isEdit: payload.isEdit,
    //       previewUrl: picture.url,
    //       timestamp: {
    //         created_at,
    //         updated_at
    //       }
    //     }
    //   });
    //
    //   yield put({
    //     type: 'toForm',
    //     payload: {
    //       model: 'widgetModel',
    //       entityKey: key,
    //       name,
    //       description,
    //       width,
    //       height
    //     }
    //   });
    //
    //   yield put({
    //     type: 'appModel/activeModel',
    //     payload: {
    //       model: 'widgetModel',
    //       instance: i18n.t('instance:widget'),
    //       isEdit: payload.isEdit,
    //       timestamp: {
    //         created_at,
    //         updated_at
    //       },
    //       title: i18n.t('model:edit', { instance: '$t(instance:widget)' })
    //     }
    //   });
    //
    //   yield take('appModel/activeModel/@@end');
    // },

    * prepareToSave({ payload }, { put, select, call }) {
      const { isEdit } = yield select((state) => state.widgetModel);

      const _payload = {
        ...payload,
        model: 'widgetModel'
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
        (state) => state.widgetModel
      );

      const save = yield call(isEdit ? updateWidget : saveWidget, {
        entityForm: payload,
        fileList,
        tags
      });

      if (request.isSuccess((save || {}).status)) {
        successSaveMsg(isEdit, i18n.t('instance:widget'));

        yield put({
          type: 'prepareToEdit',
          payload: {
            key: save.data.key
          }
        });
      }
    },

    * handleDelete({ payload }, { put, call, select }) {
      const { entityForm, isEdit } = yield select((state) => state.widgetModel);
      const entityKey = isEdit
        ? fromForm(entityForm).entityKey
        : payload.entityKey;

      const destroy = yield call(destroyWidget, { entityKey });

      if (request.isSuccess((destroy || {}).status)) {
        successDeleteMsg(i18n.t('instance:widget'));
        isEdit && (yield put(history.replace(`/pages/widgets`)));
      }
    }
  },
  reducers: {}
});
