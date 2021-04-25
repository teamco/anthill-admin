/**
 * @type {Function}
 */
import modelExtend from 'dva-model-extend';

import { widgetCommonModel } from '@/models/widget.common.model';

import { fromForm } from '@/utils/object';

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
  modalWidth: '80%',
  hideContent: false,
  propertiesModalVisible: false,
  contentProps: {},
  activeContent: null
};

/**
 * @export
 */
export default modelExtend(widgetCommonModel, {
  namespace: 'widgetContentModel',
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

    * setContentConfig({ payload }, { put, select }) {
      const { contentProps } = yield select(state => state.widgetContentModel);
      const { config, model, defaultValues, contentKey } = payload;

      yield put({
        type: 'updateState',
        payload: {
          contentProps: {
            ...contentProps,
            [contentKey]: { defaultValues, config, model }
          }
        }
      });
    },

    * handleSettingModal({ payload }, { put, select }) {
      const { contentProps } = yield select(state => state.widgetContentModel);
      const { widgetKey } = yield select(state => state.widgetModel);

      const {
        contentKey,
        widgetProps,
        visible = false,
        updateForm = false
      } = payload;

      yield put({
        type: 'updateState',
        payload: {
          updateForm,
          settingModalVisible: visible
        }
      });

      if (visible && widgetProps) {

        const { content, description } = widgetProps;
        const _contentProps = { ...contentProps[contentKey] };

        yield put({
          type: 'toForm',
          payload: {
            model: 'widgetContentModel',
            form: {
              widgetName: content,
              widgetDescription: description,
              setting: {
                ...DEFAULT_VALUES,
                ..._contentProps.defaultValues
              },
              entityType: 'widget',
              entityKey: widgetKey,
              contentKey
            }
          }
        });

        return yield put({
          type: 'updateState',
          payload: {
            activeContent: {
              contentKey,
              widgetName: content,
              configComponent: _contentProps.config
            }
          }
        });
      }

      yield put({ type: 'updateState', payload: { activeContent: null } });
    }

    // * transferFormRef({ payload }, { put, select }) {
    //   const { targetModel } = yield select((state) => state.widgetContentModel);
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
    //       model: 'widgetContentModel',
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
    //   const { widgetProps } = yield select((state) => state.widgetContentModel);
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
