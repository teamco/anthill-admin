/**
 * @type {Function}
 */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from '@/models/common.model';
import { defineAbilityFor } from '@/utils/auth/ability';
import { getToken } from '@/services/auth.service';

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'authModel',
  state: {
    MIN_PASSWORD_LENGTH: 8,
    user: null,
    isSignedOut: false,
    ability: null,
    token: null
  },
  effects: {
    * authQuery({ payload }, { put }) {
      yield put({
        type: 'defineAbilities',
        payload: { user: null }
      });
    },

    * onSignIn({ payload }, { put, call }) {
      const { email, password } = payload;
      const token = yield call(getToken, { email, password });
      debugger
    },

    * defineAbilities({ payload }, { put, call }) {
      const ability = yield call(defineAbilityFor, { user: payload.user });

      yield put({
        type: 'updateState',
        payload: { ability }
      });
    }
  },
  reducers: {}
});
