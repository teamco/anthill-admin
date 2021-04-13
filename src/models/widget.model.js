import dvaModelExtend from 'dva-model-extend';
import { history } from 'umi';

import { commonModel } from '@/models/common.model';
import i18n from '@/utils/i18n';
import { fromForm } from '@/utils/object';
import request from '@/utils/request';
import { generateKey } from '@/services/common.service';

import { successDeleteMsg, successSaveMsg } from '@/utils/message';

import {
  destroyWidget,
  getWidget,
  getWidgets,
  saveWidget,
  updateWidget,
} from '@/services/widget.service';

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'widgetModel',
  state: {
    widgets: [],
  },
  effects: {
    *widgetsQuery({ payload }, { put, call, take }) {
      const widgets = yield call(getWidgets);

      if (payload.global) {
        yield put({
          type: 'appModel/storeForm',
          payload: {
            form: null,
            model: 'widgetModel',
          },
        });

        yield put({
          type: 'appModel/activeModel',
          payload: {
            isEdit: false,
            model: 'widgetModel',
            count: widgets.data.length,
            title: i18n.t('model:list', { instance: '$t(menu:widgets)' }),
          },
        });

        yield take('appModel/activeModel/@@end');
      }

      yield put({
        type: 'updateState',
        payload: {
          widgets: widgets.data,
        },
      });
    },

    *widgetsHandleNew({ payload }, { put, select, take }) {
      let { widgets = [] } = yield select((state) => state.widgetModel);
      if (!widgets.length) {
        yield put({
          type: 'query',
          payload: { global: false },
        });
      }

      yield put({
        type: 'updateState',
        payload: {
          entityForm: [],
          fileList: [],
          tags: [],
          previewUrl: null,
          isEdit: payload.isEdit,
        },
      });

      yield put({
        type: 'appModel/activeModel',
        payload: {
          isEdit: payload.isEdit,
          model: 'widgetModel',
          title: i18n.t('model:create', { instance: '$t(instance:widget)' }),
        },
      });

      yield take('appModel/activeModel/@@end');
    },

    *prepareToEdit({ payload }, { put, call }) {
      const widget = yield call(getWidget, { key: payload.key });
      if ((widget || {}).data) {
        yield put(history.replace(`/pages/widgets/${widget.data.key}`));
      }
    },

    *widgetsHandleEdit({ payload }, { put, call, select, take }) {
      let { widgets = [] } = yield select((state) => state.widgetModel);
      if (!widgets.length) {
        yield put({
          type: 'query',
          payload: { global: false },
        });
      }

      const widget = yield call(getWidget, { key: payload.key });

      const {
        key,
        name,
        description,
        picture = {},
        width,
        height,
        tags,
        created_at,
        updated_at,
      } = (widget || {}).data || {};

      yield put({
        type: 'updateState',
        payload: {
          fileList: [],
          tags: JSON.parse(tags || '[]'),
          isEdit: payload.isEdit,
          previewUrl: picture.url,
          timestamp: {
            created_at,
            updated_at,
          },
        },
      });

      yield put({
        type: 'toForm',
        payload: {
          model: 'widgetModel',
          entityKey: key,
          name,
          description,
          width,
          height,
        },
      });

      yield put({
        type: 'appModel/activeModel',
        payload: {
          model: 'widgetModel',
          instance: i18n.t('instance:widget'),
          isEdit: payload.isEdit,
          timestamp: {
            created_at,
            updated_at,
          },
          title: i18n.t('model:edit', { instance: '$t(instance:widget)' }),
        },
      });

      yield take('appModel/activeModel/@@end');
    },

    *prepareToSave({ payload }, { put, select, call }) {
      const { isEdit } = yield select((state) => state.widgetModel);

      const _payload = {
        ...payload,
        model: 'widgetModel',
      };

      if (!isEdit) {
        _payload.entityKey = yield call(generateKey);
      }

      yield put({
        type: 'save',
        payload: _payload,
      });
    },

    *save({ payload }, { put, call, select }) {
      const { fileList, isEdit, tags } = yield select(
        (state) => state.widgetModel,
      );

      const save = yield call(isEdit ? updateWidget : saveWidget, {
        entityForm: payload,
        fileList,
        tags,
      });

      if (request.isSuccess((save || {}).status)) {
        successSaveMsg(isEdit, i18n.t('instance:widget'));

        yield put({
          type: 'prepareToEdit',
          payload: {
            key: save.data.key,
          },
        });
      }
    },

    *handleDelete({ payload }, { put, call, select }) {
      const { entityForm, isEdit } = yield select((state) => state.widgetModel);
      const entityKey = isEdit
        ? fromForm(entityForm).entityKey
        : payload.entityKey;

      const destroy = yield call(destroyWidget, { entityKey });

      if (request.isSuccess((destroy || {}).status)) {
        successDeleteMsg(i18n.t('instance:widget'));
        isEdit && (yield put(history.replace(`/pages/widgets`)));
      }
    },
  },
  reducers: {},
});
