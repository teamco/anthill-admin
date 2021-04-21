/** @type {Function} */
import modelExtend from 'dva-model-extend';
import { history } from 'umi';
import { commonModel } from '@/models/common.model';
import i18n from '@/utils/i18n';
import { deleteUser, forceSignOut, getUser, getUsers, updateUserProfile } from '@/services/user.service';
import request from '@/utils/request';
import {
  raiseConditionMsg,
  raisePermissionMsg,
  successSaveMsg
} from '@/utils/message';
import { message } from 'antd';


const DEFAULT_STATE = {
  users: [],
  selectedUser: null
};

/**
 * @export
 */
export default modelExtend(commonModel, {
  namespace: 'userModel',
  state: { ...DEFAULT_STATE },

  effects: {

    * resetState({ payload }, { put }) {
      yield put({
        type: 'cleanForm',
        payload: { DEFAULT_STATE }
      });
    },

    * query({ payload }, { call, put, select }) {
      const { ability, token } = yield select(state => state.authModel);

      if (ability.can('read', 'users')) {

        if (payload?.profiled) {
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
                selectedUser: null
              }
            });

          } else {

            return yield put({
              type: 'raiseCondition',
              payload: {
                message: raiseConditionMsg(i18n.t('instance:user')),
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
          message: raisePermissionMsg,
          redirect: true,
          type: 403
        }
      });
    },

    * signOutUser({ payload }, { put, call, select }) {
      const { ability, token } = yield select(state => state.authModel);
      const { selectedUser } = yield select(state => state.userModel);

      if (ability.can('logout', 'user')) {
        const res = yield call(forceSignOut, {
          userKey: payload?.key,
          token
        });

        if (res?.data) {
          const { errors } = res.data;

          if (res.data?.user) {
            const { metadata } = res.data?.user?.metadata;

            if (selectedUser) {
              return yield put({
                type: 'getUser',
                payload: { userKey: metadata?.key }
              });
            }

            return yield put({ type: 'query' });
          }

          return yield call(message.error, errors);
        }

        yield put({
          type: 'raiseCondition',
          payload: {
            message: raiseConditionMsg(i18n.t('instance:user')),
            redirect: false,
            type: 404
          }
        });
      }
    },

    * delete({ payload }, { put, select, call }) {
      const { ability, token, currentUser } = yield select(state => state.authModel);
      const { selectedUser } = yield select(state => state.userModel);

      if (ability.can('delete', 'user')) {
        const { metadata } = payload?.user;
        const res = yield call(deleteUser, {
          userKey: metadata?.key,
          token
        });

        if (res?.data) {
          const { errors } = res.data;

          if (errors) {
            return yield call(message.error, errors);
          }

          if (metadata?.key === currentUser.metadata.key) {
            return yield put({ type: 'authModel/signOut' });
          }

          if (selectedUser) {
            history.push('/accounts');
          } else {
            yield put({ type: 'query' });
          }
        }
      }
    },

    * getUser({ payload }, { put, call, select }) {
      const { ability, token } = yield select(state => state.authModel);

      if (ability.can('read', 'users')) {
        const res = yield call(getUser, { userKey: payload.userKey, token });

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
                  ...{ entityKey: key }
                }
              }
            });

            yield put({
              type: 'updateState',
              payload: {
                selectedUser: user,
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
          message: raisePermissionMsg,
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
            message: raisePermissionMsg,
            redirect: false,
            type: 403
          }
        });
      }
    }
  },

  reducers: {}
});
