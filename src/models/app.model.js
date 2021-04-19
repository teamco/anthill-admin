/**
 * @type {Function}
 */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from '@/models/common.model';
import { menus } from '@/services/menu.service';

const appMeta = {
  name: 'AntHill API',
  charSet: 'utf-8'
};

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'appModel',
  state: {
    interval: {
      timeout: 20000,
      enabled: true
    },
    layoutOpts: {
      mainHeader: false,
      pageBreadcrumbs: false,
      pageHeader: false,
      mainFooter: false,
      mainMenu: false
    },
    activeTab: true,
    collapsedMenu: true,
    menus: [],
    meta: { ...appMeta, ...{ title: '' } },
    activeForm: {
      form: null
    },
    activeModel: {
      isEdit: false,
      title: ''
    }
  },

  effects: {

    * appQuery({ payload }, { put, select }) {
      const { mode } = yield select((state) => state.appModel);

      if (mode) {
        return false;
      }

      yield put({
        type: 'updateState',
        payload: {
          menus
        }
      });

      yield put({
        type: 'adminLayout',
        payload: {
          visible: true
        }
      });
    },

    * adminLayout({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          layoutOpts: {
            mainHeader: payload.visible,
            pageBreadcrumbs: payload.visible,
            pageHeader: payload.visible,
            mainFooter: payload.visible,
            mainMenu: payload.visible
          }
        }
      });
    },

    * updateDocumentMeta({ payload }, { put, select }) {
      const { meta } = yield select(state => state.appModel);
      yield put({
        type: 'updateState',
        payload: {
          meta: { ...meta, ...payload.meta }
        }
      });
    },

    * storeForm({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          activeForm: payload
        }
      });
    },

    * activeModel({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          activeModel: { ...payload }
        }
      });
    },

    * activeButtons({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          activeButtons: { ...payload }
        }
      });
    },

    * toggleMenu({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          collapsedMenu: payload.collapse
        }
      });
    },

    * checkActiveTab({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          activeTab: payload
        }
      });
    },

    * notification(_, { put }) {
      console.log('notification')
    }
  },
  reducers: {}
});
