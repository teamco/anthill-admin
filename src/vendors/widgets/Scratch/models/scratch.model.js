/**
 * @type {Function}
 */
import modelExtend from 'dva-model-extend';
import { widgetCommonModel } from '@/models/widget.common.model';

const DEFAULT_VALUES = {};
const DEFAULT_STATE = {};

/**
 * @export
 * @default
 */
export default modelExtend(widgetCommonModel, {
  namespace: 'scratchModel',
  state: {},

  subscriptions: {
    setup({dispatch}) {
    }
  },

  effects: {

    * setProperties({payload}, {put}) {
      yield put({
        type: 'contentModel/setContentConfig',
        payload: {
          config: payload.config,
          defaultValues: {...DEFAULT_VALUES},
          model: 'scratchModel'
        }
      });
    }
  },

  reducers: {}
});
