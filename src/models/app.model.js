/**
 * @type {Function}
 */
import modelExtend from 'dva-model-extend';

import { commonModel } from '@/models/common.model';
import { menus } from '@/services/menu.service';

const appMeta = {
  name: 'AntHill API',
  charSet: 'utf-8'
};

const DEFAULT_STATE = {
  interval: {
    timeout: 20000,
    enabled: true
  },
  layoutOpts: {
    mainHeader: false,
    pageBreadcrumbs: false,
    mainFooter: false,
    mainMenu: false
  },
  activeTab: true,
  collapsedMenu: true,
  menus: [],
  meta: { ...appMeta, ...{ title: '' } }
};

/**
 * @export
 */
export default modelExtend(commonModel, {
  namespace: 'appModel',
  state: { ...DEFAULT_STATE },

  effects: {

    * appQuery({ payload }, { put, select }) {
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
      console.log('notification');
    }
  },
  reducers: {}
});
