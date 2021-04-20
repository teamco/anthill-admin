/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from '@/models/common.model';

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'pageModel',
  state: {
    pageHeader: false
  },

  subscriptions: {
    setup({ dispatch, history }, onError) {
      return history.listen((data) => {
        dispatch({ type: 'authModel/defineAbilities', payload: { login: true } });

      });
    }
  },

  effects: {

    * query({ payload }, { put, select }) {
    }
  },
  reducers: {}
});
