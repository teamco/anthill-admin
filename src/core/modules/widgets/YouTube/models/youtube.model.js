import dvaModelExtend from 'dva-model-extend';

import {commonModel} from '@/models/common';
import {getEmbedCode} from '@/widgets/YouTube/src/youtube.service';

const DEFAULTS = {
  'youtube/embedUrl': 'https://www.youtube.com/embed/ALZHF5UqnU4'
};

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'youtubeModel',
  state: {
    defaults: {}
  },
  subscriptions: {
    setup({dispatch}) {
    }
  },
  effects: {

    * setProperties({payload}, {put, select}) {
      const {entityForm} = yield select(state => state.youtubeModel);

      if (payload.embedUrl) {
        DEFAULTS['youtube/embedUrl'] = payload.embedUrl;
      }

      yield put({
        type: 'contentModel/setContentProperties',
        payload: {
          contentProperties: payload.properties,
          contentForm: {...DEFAULTS},
          target: 'youtubeModel'
        }
      });

      if (payload.embedUrl) {
        yield put({
          type: 'toForm',
          payload: {
            model: 'youtubeModel',
            entityType: 'widget',
            youtubeSrc: getEmbedCode(DEFAULTS['youtube/embedUrl'])
          }
        });
      }
    },

    * updatePreview({payload}, {put}) {
      yield put({
        type: 'updateState',
        payload: {
          youtubePreview: getEmbedCode(payload.youtubePreview)
        }
      });
    }
  },
  reducers: {}
});
