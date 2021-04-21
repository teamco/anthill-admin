/** @type {Function} */
import modelExtend from 'dva-model-extend';

import { commonModel } from '@/models/common.model';
import { monitorHistory } from '@/utils/history';

/**
 * @export
 */
export default modelExtend(commonModel, {
  namespace: 'errorModel',
  state: {
    data: [],
  },
  effects: {
    *query({ payload }, { put, select }) {},
  },
  reducers: {},
});
