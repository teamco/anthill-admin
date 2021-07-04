import { getEntityFormIdx } from '@/services/common.service';
import { message } from 'antd';
import { history } from 'umi';
import { merge } from 'lodash';

const DEFAULT_FORM = [
  {
    name: 'entityType',
    value: 'form'
  },
  {
    name: 'entityKey',
    value: ''
  }
];

const DEFAULT_STATE = {
  referrer: document.referrer,
  resetForm: false,
  entityForm: DEFAULT_FORM,
  language: 'en-US',
  isEdit: false,
  touched: false,
  removeFile: false,
  previewUrl: null,
  tags: [],
  fileList: [],
  fileName: null
};

/**
 * @constant
 * @export
 */
const commonModel = {
  state: {
    ...DEFAULT_STATE
  },

  effects: {

    * updateTags({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: { tags: payload.tags }
      });
    },

    * cleanForm({ payload = {} }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          ...DEFAULT_STATE,
          ...payload?.DEFAULT_STATE
        }
      });
    },

    * toForm({ payload }, { call, put, select }) {
      const { entityForm } = yield select((state) => state[payload.model]);
      const _entityForm = [...entityForm];
      const toDelete = [];

      const keys = Object.keys(payload.form);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const idx = yield call(getEntityFormIdx, { entityForm, key });

        const formItem = {
          name: key,
          value: payload.form[key]
        };

        // Overwrite existing values
        if (idx > -1) {
          toDelete.push(idx);
        }

        _entityForm.push(formItem);
      }

      yield put({
        type: 'updateState',
        payload: {
          entityForm: [
            ..._entityForm.filter((form, idx) => toDelete.indexOf(idx) === -1)
          ]
        }
      });
    },

    * updateFields({ payload }, { call, put, select }) {
      const { entityForm } = yield select((state) => state[payload.model]);
      const _entityForm = [...entityForm];

      for (let i = 0; i < payload.changedFields.length; i++) {
        const { name, value } = payload.changedFields[i];

        const idx = yield call(getEntityFormIdx, { entityForm, key: name });
        const formItem = { name, value };

        if (idx > -1) {
          _entityForm.splice(idx, 1);
        }

        _entityForm.push(formItem);
      }

      yield put({
        type: 'updateState',
        payload: {
          touched: true,
          entityForm: [..._entityForm]
        }
      });
    },

    * handleAddFile({ payload }, { put, select }) {
      const { fileList } = yield select((state) => state[payload.model]);

      const previewUrl = URL.createObjectURL(payload?.file);

      yield put({
        type: 'updateState',
        payload: {
          touched: true,
          removeFile: false,
          previewUrl,
          fileList: [...fileList, payload?.file],
          fileName: payload?.file?.name
        }
      });
    },

    * handleRemoveFile({ payload }, { put, select }) {
      const { fileList } = yield select((state) => state[payload.model]);

      let newFileList = [];

      if (payload?.file) {
        const index = fileList.indexOf(payload.file);
        newFileList = fileList.slice();
        newFileList.splice(index, 1);
      }

      yield put({
        type: 'updateState',
        payload: {
          touched: true,
          removeFile: !payload?.file,
          previewUrl: null,
          fileList: newFileList,
          fileName: null
        }
      });
    },

    * raiseCondition({ payload }) {
      message.warning(payload.message).then(() => {
        payload.redirect && history.push(`/errors/${payload.type}`);
      });
    }
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },

    mergeState(state, { payload }) {
      return merge({}, state, payload);
    }
  }
};

export { commonModel };
