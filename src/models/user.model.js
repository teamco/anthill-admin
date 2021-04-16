/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';
import { message } from 'antd';
import { commonModel } from '@/models/common.model';
import i18n from '@/utils/i18n';
import { getUser, getUsers } from '@/services/user.service';
import { generateKey } from '@/services/common.service';

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'userModel',
  state: {
    users: [],
    user: null
  },

  effects: {

    * query({ payload }, { call, put, select }) {
      const { ability, token } = yield select(state => state.authModel);

      if (ability.can('read', 'users')) {
        const res = yield call(getUsers, { token });

        if (res?.data) {
          const { users, error } = res.data;
          if (users) {

            return yield put({
              type: 'updateState',
              payload: {
                users,
                user: null
              }
            });

          } else {

            return yield put({
              type: 'raiseCondition',
              payload: {
                message: i18n.t('error:notFound', { instance: i18n.t('instance:user') }),
                type: 404
              }
            });
          }
        }
      }

      yield put({
        type: 'raiseCondition',
        payload: {
          message: i18n.t('error:notFound', { instance: i18n.t('instance:user') }),
          type: 403
        }
      });
    },

    * delete({ payload }, { put }) {
      // const { user } = payload;
      //
      // if (user.metadata.isLocked) {
      //   return message.warning(i18n.t('auth:errorLockedDelete', { instance: user.email })).then();
      // } else {
      // }
    },

    * lock({ payload }, { put, call }) {
      // const { user } = payload;
      //
      // let _userExist = yield call(findUser, {
      //   uid: user.uid,
      //   metadata: {
      //     isLocked: true,
      //     updatedAt: +(new Date)
      //   }
      // });
      //
      // yield put({
      //   type: 'updateQuery',
      //   payload: { _userExist }
      // });
    },

    * unlock({ payload }, { put, call }) {
      // const { user } = payload;
      //
      // let _userExist = yield call(findUser, {
      //   uid: user.uid,
      //   metadata: {
      //     isLocked: false,
      //     updatedAt: +(new Date)
      //   }
      // });
      //
      // yield put({
      //   type: 'updateQuery',
      //   payload: { _userExist }
      // });
    },

    * validateUser({ payload }, { put }) {
      // const { selectedUser, userId } = payload;
      //
      // if (selectedUser?.id === userId) {
      //   // TODO (teamco): Do something.
      // } else {
      //   yield put({ type: 'getUser', payload: { userId } });
      // }
    },

    * getUser({ payload }, { put, call, select }) {
      const { ability, token } = yield select(state => state.authModel);

      if (ability.can('read', 'users')) {
        const res = yield call(getUser, { key: payload.user, token });

        if (res?.data) {
          const { user, error } = res.data;
          if (user) {

            yield put({
              type: 'toForm',
              payload: {
                model: 'websiteModel',
                form: {
                  ...{ name: user.metadata.profile.name },
                  ...{ entityKey: user?.key || (yield call(generateKey)) }
                }
              }
            });

            return yield put({
              type: 'updateState',
              payload: { user }
            });
          } else {

            return yield put({
              type: 'raiseCondition',
              payload: {
                message: i18n.t('error:notFound', { instance: i18n.t('instance:user') }),
                type: 404
              }
            });

          }
        }
      }

      yield put({
        type: 'raiseCondition',
        payload: {
          message: i18n.t('error:notFound', { instance: i18n.t('instance:user') }),
          type: 403
        }
      });
    }
  },
  reducers: {}
});
