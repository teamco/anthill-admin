/**
 * @type {Function}
 */
import modelExtend from 'dva-model-extend';

import { widgetCommonModel } from '@/models/widget.common.model';

const DEFAULT_VALUES = {
  widget: {
    overlapping: true,
    alwaysOnTop: false,
    freeze: false,
    draggable: true,
    resizable: true,
    scrollable: false,
    maximizable: false,
    zoomable: false,
    stretchWidth: false,
    stretchHeight: false,
    unstick: 'widgetUnstick',
    stick: false,
    statistics: false,
    hideContentOnInteraction: true,
    pageContainment: false,
    showInMobile: true,
    setLayerUp: 0,
    cellWidth: 0,
    rowHeight: 0
  }
};

const DEFAULT_STATE = {
  opacity: 1,
  hideContent: false,
  propertiesModalVisible: false,

  config: null,
  model: null,
  defaultValues: []
};

/**
 * @export
 */
export default modelExtend(widgetCommonModel, {
  namespace: 'contentModel',
  state: { ...DEFAULT_STATE },

  subscriptions: {
    setup({ dispatch }) {
    }
  },

  effects: {

    * resetState({ payload }, { put }) {
      yield put({
        type: 'cleanForm',
        payload: { DEFAULT_STATE }
      });
    },

    * setContentConfig({ payload }, { put }) {
      const { config, model, defaultValues } = payload;

      yield put({
        type: 'updateState',
        payload: { defaultValues, config, model }
      });
    },

    * handleSettingModal({ payload }, { put, select }) {
      const { contentForm } = yield select(state => state.contentModel);
      const { visible = false, widgetProps, updateForm = false } = payload;

      yield put({
        type: 'updateState',
        payload: {
          settingModalVisible: visible,
          widgetProps,
          updateForm
        }
      });

      const { name, description, contentKey, key } = widgetProps;

      const model = {
        ...DEFAULT_VALUES,
        widgetName: name,
        widgetDescription: description,
        ...contentForm,
        contentKey,
        entityKey: key,
        entityType: 'widget'
      };

      yield put({
        type: 'toForm',
        payload: {
          model: 'contentModel',
          form: {
            [widgetProps?.key]: { ...model }
          }
        }
      });
    }
    //
    //
    // * transferFormRef({ payload }, { put, select }) {
    //   const { targetModel } = yield select((state) => state.contentModel);
    //   yield put({
    //     type: `${targetModel}/updateState`,
    //     payload: { widgetForm: payload.form }
    //   });
    // },
    //
    // * updateContentForm({ payload }, { put }) {
    //   yield put({
    //     type: 'toForm',
    //     payload: {
    //       model: 'contentModel',
    //       ...payload.props
    //     }
    //   });
    // },
    //
    // * setOpacity({ payload }, { put }) {
    //   yield put({
    //     type: 'updateState',
    //     payload: { opacity: payload.opacity }
    //   });
    // },
    //
    // * hideContent({ payload }, { put, select }) {
    //   const { widgetProps } = yield select((state) => state.contentModel);
    //   yield put({
    //     type: 'updateState',
    //     payload: {
    //       hideContent: payload.hide
    //         ? widgetProps.entityForm.widgetHideContentOnInteraction
    //         : false
    //     }
    //   });
    // },
    //
    // * widgetStick({ payload }, { put, call, select }) {
    //   const { widget } = yield select((state) => state.pageModel);
    //
    //   if (widget) {
    //     const model = widget.entityForm;
    //     model.widgetStick = payload.stickTo;
    //     model.widgetDraggable = false;
    //     model.widgetResizable = false;
    //
    //     const _toEntityForm = yield call(toEntityForm, { model });
    //
    //     yield put({
    //       type: 'toForm',
    //       payload: { entityForm: _toEntityForm }
    //     });
    //   }
    // },
    //
    // * widgetUnstick({ payload }, { put, call, select }) {
    //   const { widget } = yield select((state) => state.pageModel);
    //
    //   if (widget) {
    //     const model = widget.entityForm;
    //     if (payload.unstick) {
    //       model.widgetUnstick = DEFAULTS.widgetUnstick;
    //       model.widgetDraggable = DEFAULTS.widgetDraggable;
    //       model.widgetResizable = DEFAULTS.widgetResizable;
    //       model.widgetStick = false;
    //     } else {
    //       model.widgetUnstick = false;
    //     }
    //
    //     const _toEntityForm = yield call(toEntityForm, { model });
    //
    //     yield put({
    //       type: 'toForm',
    //       payload: { entityForm: _toEntityForm }
    //     });
    //   }
    // }
  },
  reducers: {}
});
