import dvaModelExtend from 'dva-model-extend';

import {commonModel} from '@/models/common';

const DEFAULTS = {};

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'scratchModel',
  state: {
    defaults: {}
  },
  subscriptions: {
    setup({dispatch}) {
    }
  },
  effects: {

    * setProperties({payload}, {put}) {
      yield put({
        type: 'contentModel/setContentProperties',
        payload: {
          contentProperties: payload.properties,
          contentForm: {...DEFAULTS},
          target: 'scratchModel'
        }
      });

      yield put({
        type: 'updateState',
        payload: {
          defaults: DEFAULTS
        }
      });
    }
  },
  reducers: {}
});
