/**
 * @type {Function}
 */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from '@/models/common.model';
import { menus } from '@/services/menu.service';

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'appModel',
  state: {
    layoutOpts: {
      mainHeader: false,
      pageBreadcrumbs: false,
      pageHeader: false,
      mainFooter: false,
      mainMenu: false,
    },
    activeTab: true,
    collapsedMenu: true,
    menus: [],
    activeForm: {
      form: null,
    },
    activeModel: {
      isEdit: false,
      title: '',
    },
  },
  effects: {
    *query({ payload }, { put, select }) {
      const { mode } = yield select((state) => state.appModel);

      if (mode) {
        return false;
      }

      yield put({
        type: 'updateState',
        payload: {
          menus,
        },
      });

      yield put({
        type: 'adminLayout',
        payload: {
          visible: true,
        },
      });
    },

    *adminLayout({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          layoutOpts: {
            mainHeader: payload.visible,
            pageBreadcrumbs: payload.visible,
            pageHeader: payload.visible,
            mainFooter: payload.visible,
            mainMenu: payload.visible,
          },
        },
      });
    },

    *storeForm({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          activeForm: payload,
        },
      });
    },

    *activeModel({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          activeModel: { ...payload },
        },
      });
    },

    *activeButtons({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          activeButtons: { ...payload },
        },
      });
    },

    *toggleMenu({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          collapsedMenu: payload.collapse,
        },
      });
    },

    *checkActiveTab({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          activeTab: payload,
        },
      });
    },

    *notification(_, { put }) {},
  },
  reducers: {},
});
