/**
 * @type {Function}
 */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from '@/models/common.model';
import { defineAbilityFor } from '@/utils/auth/ability';
import { getToken } from '@/services/auth.service';
import { addStore, deleteStore } from '@/utils/storage';
import { API_CONFIG } from '@/services/config';
import { getCurrentUser } from '@/services/user.service';

/**
 * @constant
 * @type {{SERVER_PORT: number, API: string, SERVER_URL: string, ANTHILL_KEY: string}}
 */
const apiConfig = API_CONFIG();

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'authModel',
  state: {
    MIN_PASSWORD_LENGTH: 8,
    user: null,
    isSignedOut: true,
    ability: null,
    token: null,
    error: null
  },
  effects: {

    * signIn({ payload }, { put, call }) {
      const { email, password } = payload;
      const res = yield call(getToken, { email, password });

      if (res?.data) {
        const { token, error } = res.data;

        if (token) {
          addStore(apiConfig.ANTHILL_KEY, token);

          yield put({
            type: 'updateState',
            payload: {
              token,
              error: null,
              isSignedOut: false
            }
          });

          yield put({ type: 'defineAbilities', payload: { login: true } });
        }

        if (error) {
          yield put({ type: 'updateState', payload: { error } });
          yield put({ type: 'signOut' });
        }
      }
    },

    * signOut({ payload }, { put }) {
      deleteStore(apiConfig.ANTHILL_KEY);

      yield put({
        type: 'updateState',
        payload: {
          token: null,
          isSignedOut: true
        }
      });

      yield put({ type: 'defineAbilities', payload: { login: false } });
    },

    * defineAbilities({ payload = {} }, { put, call, select }) {
      let { token, ability } = yield select(state => state.authModel);
      const { login } = payload;

      if (login) {
        const res = yield call(getCurrentUser, { token });

        if (res?.data) {
          const { user, error } = res?.data;

          if (user) {
            ability = yield call(defineAbilityFor, { user });
            return yield put({
              type: 'updateState',
              payload: { ability, user }
            });
          }

          if (error) {
            yield put({ type: 'updateState', payload: { error } });
            yield put({ type: 'signOut' });
          }
        }

      } else {

        ability = yield call(defineAbilityFor, { user: null });
        yield put({
          type: 'updateState',
          payload: {
            ability,
            user: null
          }
        });
      }
    }
  },
  reducers: {}
});
