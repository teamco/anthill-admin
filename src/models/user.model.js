/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';
import { message } from 'antd';
import { commonModel } from '@/models/common.model';
import i18n from '@/utils/i18n';
import { getUser, getUsers } from '@/services/user.service';

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'userModel',
  state: {
    profiles: [1],
    selectedProfile: null,
    selectedUser: null,
    users: [],
    verificationSent: false
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
              payload: { users }
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
        debugger
        const res = yield call(getUser, { user: payload.user, token });

        if (res?.data) {
          const { users, error } = res.data;
          if (users) {

            debugger
          }
        }
        // const { userId } = payload;
        //
        // if (user?.uid) {
        //   const ability = yield call(defineAbilityFor, { user, userId });
        //
        //   yield put({
        //     type: 'authModel/updateState',
        //     payload: { ability }
        //   });
        //
        //   if (ability.can('read', 'profile')) {
        //     const _user = yield call(fbFindById, {
        //       collection: 'users',
        //       doc: userId
        //     });
        //
        //     if (_user.exists) {
        //       const selectedUser = { ..._user.data(), ...{ id: _user.id } };
        //
        //       return yield put({
        //         type: 'updateState',
        //         payload: { selectedUser }
        //       });
        //     }
        //
        //     yield put({
        //       type: 'raiseCondition',
        //       payload: {
        //         message: i18n.t('error:notFound', { entity: 'User' }),
        //         key: 'selectedUser'
        //       }
        //     });
        //   }
        // }
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
