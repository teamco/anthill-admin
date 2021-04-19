/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';
import { history } from 'umi';
import { commonModel } from '@/models/common.model';
import i18n from '@/utils/i18n';
import { forceSignOut, getUser, getUsers, updateUserProfile } from '@/services/user.service';
import { generateKey } from '@/services/common.service';
import request from '@/utils/request';
import { successSaveMsg } from '@/utils/message';

/**
 * @constant
 * @type {string}
 */
const raiseConditionMsg = i18n.t('error:notFound', { instance: i18n.t('instance:user') });

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

        if (payload.profiled) {
          return false;
        }

        const res = yield call(getUsers, { token });

        if (res?.data) {
          const { users, errors } = res.data;
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
                message: raiseConditionMsg,
                redirect: true,
                type: 404
              }
            });
          }
        }
      }

      yield put({
        type: 'raiseCondition',
        payload: {
          message: raiseConditionMsg,
          redirect: true,
          type: 403
        }
      });
    },

    * signOutUser({ payload }, { put, call, select }) {
      const { ability, token } = yield select(state => state.authModel);

      if (ability.can('logout', 'user')) {
        const signOut = yield call(forceSignOut, {
          key: payload?.key,
          token
        });
        
        debugger
      }
    },

    * delete({ payload }, { put }) {
      // const { user } = payload;
      //
      // if (user.metadata.isLocked) {
      //   return message.warning(i18n.t('auth:errorLockedDelete', { instance: user.email })).then();
      // } else {
      // }
    },

    * getUser({ payload }, { put, call, select }) {
      const { ability, token } = yield select(state => state.authModel);

      if (ability.can('read', 'users')) {
        const res = yield call(getUser, { key: payload.userKey, token });

        if (res?.data) {
          const { user, errors } = res.data;
          if (user) {

            const { profile, key } = user.metadata;
            const { name, profile_image } = profile;

            yield put({
              type: 'toForm',
              payload: {
                model: 'userModel',
                form: {
                  ...{ name },
                  ...{ entityKey: key || (yield call(generateKey)) }
                }
              }
            });

            yield put({
              type: 'updateState',
              payload: {
                user,
                users: [user],
                touched: false,
                fileList: [],
                previewUrl: profile_image?.url || null
              }
            });

          }

          return false;
        }
      }

      yield put({
        type: 'raiseCondition',
        payload: {
          message: raiseConditionMsg,
          redirect: true,
          type: 403
        }
      });
    },

    * updateProfile({ payload }, { put, call, select }) {
      const { fileList, isEdit, tags, removeFile } = yield select(state => state.userModel);
      const { ability, token } = yield select(state => state.authModel);

      if (ability.can('update', 'userProfile')) {
        const save = yield call(updateUserProfile, {
          entityForm: payload,
          removeFile,
          fileList,
          tags,
          token
        });

        if (request.isSuccess((save || {}).status)) {
          successSaveMsg(isEdit, i18n.t('instance:user'));

          yield put({
            type: 'getUser',
            payload: { userKey: save?.data?.user?.metadata?.key }
          });

          yield put({
            type: 'updateState',
            payload: { touched: false }
          });
        }
      } else {

        yield put({
          type: 'raiseCondition',
          payload: {
            message: raiseConditionMsg,
            redirect: false,
            type: 403
          }
        });
      }
    }
  },
  reducers: {}
});
