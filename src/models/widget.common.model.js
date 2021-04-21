/**
 * @type {Function}
 */
import modelExtend from 'dva-model-extend';
import { commonModel } from '@/models/common.model';

const DEFAULT_STATE = {};

/**
 * @export
 * @constant
 */
const widgetCommonModel = modelExtend(commonModel, {
  namespace: 'widgetCommonModel',
  state: { ...DEFAULT_STATE },

  effects: {},

  reducers: {}
});

export { widgetCommonModel };
