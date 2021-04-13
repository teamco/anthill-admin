import dvaModelExtend from 'dva-model-extend';

import {commonModel} from '@/models/common';
import {findFilterIdx, handleMultipleFilters} from '@/widgets/Picture/src/picture.service';
import {fromForm} from '@/utils/state';

const DEFAULTS = {
  'picture/imageUrl': 'https://www.publicdomainpictures.net/pictures/320000/nahled/background-image.png',
  'picture/brightness': 1,
  'picture/contrast': 1.1,
  'picture/grayscale': 0.1,
  'picture/opacity': 100,
  'picture/hueRotate': 0,
  'picture/saturate': 1,
  'picture/scale': 1,
  'picture/scaleX': 1,
  'picture/scaleY': 1,
  'picture/invert': 0.1
};

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'pictureModel',
  state: {
    style: {},
    defaults: {},
    sliderProps: {
      visible: false,
      filter: {},
      transform: {}
    },
    selectedFilters: []
  },
  subscriptions: {
    setup({dispatch}) {
    }
  },
  effects: {

    * setProperties({payload}, {put, select}) {
      const {entityForm} = yield select(state => state.pictureModel);

      yield put({
        type: 'contentModel/setContentProperties',
        payload: {
          contentProperties: payload.properties,
          contentForm: {...DEFAULTS},
          target: 'pictureModel'
        }
      });

      const {pictureImageUrlPreview} = fromForm(entityForm);

      yield put({
        type: 'toForm',
        payload: {
          model: 'youtubeModel',
          pictureImageUrlPreview: pictureImageUrlPreview || DEFAULTS['picture/imageUrl']
        }
      });
    },

    * updatePreview({payload}, {put}) {
      yield put({
        type: 'toForm',
        payload: {
          model: 'pictureModel',
          pictureImageUrlPreview: payload.pictureImageUrlPreview
        }
      });
    },

    * updateSelectedFilters({payload}, {put, select}) {
      const {selectedFilters} = yield select(state => state.pictureModel);
      const filter = payload.filter;

      if (!selectedFilters.find(selected => selected.filter === filter)) {
        selectedFilters.push(payload);
      }

      yield put({
        type: 'updateState',
        payload: {
          selectedFilters
        }
      });
    },

    * selectFilter({payload}, {put, select}) {
      const {selectedFilters} = yield select(state => state.pictureModel);
      const filter = payload.filter;

      if (selectedFilters.find(selected => selected.filter === filter)) {
        yield put({
          type: 'updateState',
          payload: {}
        });
      }
    },

    * removeFilter({payload}, {put, select}) {
      let {
        selectedFilters,
        style
      } = yield select(state => state.pictureModel);

      let _filter = style.filter.split(' ');
      const idx = findFilterIdx(style, payload);

      if (idx > -1) {
        _filter.splice(idx, 1);
        style.filter = _filter.join(' ');
        selectedFilters = selectedFilters.filter(selected => selected.filter !== payload.filter);

        yield put({
          type: 'cleanEntityForm',
          payload: {
            key: payload.filter,
            model: 'contentModel',
            namespace: 'picture'
          }
        });
      }

      yield put({
        type: 'updateState',
        payload: {
          style,
          selectedFilters
        }
      });
    },

    * updateFilter({payload}, {put, select, call}) {
      const {style} = yield select(state => state.pictureModel);

      let _selectedFilters = yield call(handleMultipleFilters, {
        filterType: 'cssFilter',
        style,
        payload
      });

      yield put({
        type: 'updateSelectedFilters',
        payload
      });

      yield put({
        type: 'updateState',
        payload: {style: {filter: _selectedFilters}}
      });
    },

    * updateTransform({payload}, {put, select}) {
      const {style} = yield select(state => state.pictureModel);

      let _selectedFilters = yield call(handleMultipleFilters, {
        style,
        filterType: 'cssTransform',
        payload
      });

      yield put({
        type: 'updateSelectedFilters',
        payload
      });

      yield put({
        type: 'updateState',
        payload: {
          style: {
            transform: _selectedFilters
          }
        }
      });
    },

    * updateFilterSlider({payload}, {put}) {
      const {props} = payload;

      props.key = props.name;
      props.marks = {
        [props.min]: {
          label: `${props.min}${props.unit || ''}`
        },
        [props.max]: {
          label: `${props.max}${props.unit || ''}`
        }
      };

      yield put({
        type: 'toForm',
        payload: {
          model: 'pictureModel',
          selectedFilter: props.name
        }
      });

      yield put({
        type: 'updateState',
        payload: {
          sliderProps: {
            defaultValue: DEFAULTS[props.name],
            visible: true,
            filter: props
          }
        }
      });
    }
  },
  reducers: {}
});
