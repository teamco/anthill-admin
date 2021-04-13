/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';

import { commonModel } from '@/models/common.model';
import { monitorHistory } from '@/utils/history';

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'errorModel',
  state: {
    data: [],
  },
  effects: {
    *query({ payload }, { put, select }) {},
  },
  reducers: {},
});
