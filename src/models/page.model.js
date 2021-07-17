/** @type {Function} */
import modelExtend from 'dva-model-extend';

import { commonModel } from '@/models/common.model';

/**
 * @export
 */
export default modelExtend(commonModel, {
  namespace: 'pageModel',
  state: {
  },

  subscriptions: {
    setup({ dispatch, history }, onError) {
      return history.listen((data) => {
        // dispatch({ type: 'authModel/defineAbilities', payload: { login: true } });

      });
    }
  },

  effects: {

    * query({ payload }, { put, select }) {
    }
  },
  reducers: {}
});
