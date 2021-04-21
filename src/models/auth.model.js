/**
 * @type {Function}
 */
import modelExtend from 'dva-model-extend';

import { commonModel } from '@/models/common.model';
import { defineAbilityFor } from '@/utils/auth/ability';
import { getToken } from '@/services/auth.service';
import { addStore, deleteStore } from '@/utils/storage';
import { API_CONFIG } from '@/services/config';
import { getCurrentUser, registerUser } from '@/services/user.service';
import { generateKey } from '@/services/common.service';
import { message } from 'antd';
import i18n from '@/utils/i18n';

/**
 * @constant
 * @type {{SERVER_PORT: number, API: string, SERVER_URL: string, ANTHILL_KEY: string}}
 */
const apiConfig = API_CONFIG();

const DEFAULT_STATE = {
  MIN_PASSWORD_LENGTH: 8,
  currentUser: null,
  isSignedOut: true,
  ability: null,
  token: null,
  errors: null,
  registered: false
};

/**
 * @export
 */
export default modelExtend(commonModel, {
  namespace: 'authModel',
  state: { ...DEFAULT_STATE },

  effects: {

    * signIn({ payload }, { put, call }) {
      const { email, password } = payload;
      const res = yield call(getToken, { email, password });

      if (res?.data) {
        const { token, errors } = res.data;

        if (token) {
          addStore(apiConfig.ANTHILL_KEY, token);

          yield put({
            type: 'updateState',
            payload: {
              token,
              errors: null,
              registered: false,
              isSignedOut: false
            }
          });

          yield put({ type: 'defineAbilities', payload: { login: true } });
        }

        if (errors) {
          yield put({ type: 'updateState', payload: { errors } });
          yield put({ type: 'signOut' });

          yield call(message.error, errors);
        }
      }
    },

    * signOut({ payload }, { put, call }) {
      deleteStore(apiConfig.ANTHILL_KEY);

      yield put({
        type: 'updateState',
        payload: {
          ability: (yield call(defineAbilityFor, { user: null })),
          token: null,
          currentUser: null,
          isSignedOut: true
        }
      });

      yield put({ type: 'defineAbilities', payload: { login: false } });
    },

    * signUp({ payload }, { put, call, select }) {
      const key = yield call(generateKey);
      const res = yield call(registerUser, { ...payload, key });

      if (res?.data) {
        const { user, errors } = res.data;

        if (user) {
          yield put({
            type: 'updateState',
            payload: { registered: user }
          });
        }
      }
    },

    * defineAbilities({ payload = {} }, { put, call, select }) {
      const { token } = yield select(state => state.authModel);
      const { login } = payload;

      let ability = yield call(defineAbilityFor, { user: null });

      if (login) {

        /**
         * @type {{data:{
         *  user:{metadata:{auth:{force_sign_out}}},
         *  errors
         * }}}
         */
        const res = yield call(getCurrentUser, { token });

        if (res?.data) {
          const { user, errors } = res.data;

          // Handle forced logout user
          if (user?.metadata?.auth?.force_sign_out) {
            return yield put({ type: 'signOut' });
          }

          if (user) {
            ability = yield call(defineAbilityFor, { user });
            yield put({
              type: 'updateState',
              payload: {
                currentUser: user,
                registered: false
              }
            });
          }

          if (errors) {
            yield put({ type: 'updateState', payload: { errors } });
            yield put({ type: 'signOut' });

            yield call(message.error, errors);
          }
        }
      }

      yield put({ type: 'updateState', payload: { ability } });
    }
  },
  reducers: {}
});
