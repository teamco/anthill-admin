/**
 * @type {Function}
 */
import modelExtend from 'dva-model-extend';
import { widgetCommonModel } from '@/models/widget.common.model';

import { findFilterIdx, handleMultipleFilters } from '@/vendors/widgets/Picture/services/picture.service';
import { fromForm } from '@/utils/object';

const DEFAULT_VALUES = {
  picture: {
    imageUrl: 'https://www.publicdomainpictures.net/pictures/320000/nahled/background-image.png',
    brightness: 1,
    contrast: 1.1,
    grayscale: 0.1,
    opacity: 100,
    hueRotate: 0,
    saturate: 1,
    scale: 1,
    scaleX: 1,
    scaleY: 1,
    invert: 0.1
  }
};

const DEFAULT_STATE = {
  style: {},
  defaultValues: {},
  sliderProps: {
    visible: false,
    filter: {},
    transform: {}
  },
  selectedFilters: []
};

/**
 * @export
 * @default
 */
export default modelExtend(widgetCommonModel, {
  namespace: 'pictureModel',
  state: {},

  subscriptions: {
    setup({ dispatch }) {
    }
  },

  effects: {

    * setProperties({ payload }, { put, select }) {
      const { entityForm } = yield select(state => state.pictureModel);

      yield put({
        type: 'contentModel/setContentConfig',
        payload: {
          config: payload.config,
          defaultValues: { ...DEFAULT_VALUES },
          model: 'pictureModel'
        }
      });

      yield put({
        type: 'toForm',
        payload: {
          model: 'pictureModel',
          form: {
            imageUrl: fromForm(entityForm, 'imageUrl') ||
              DEFAULT_VALUES.picture.imageUrl
          }
        }
      });
    },

    * updatePreview({ payload }, { put }) {
      yield put({
        type: 'toForm',
        payload: {
          model: 'pictureModel',
          pictureImageUrlPreview: payload.pictureImageUrlPreview
        }
      });
    }

    // * updateSelectedFilters({payload}, {put, select}) {
    //   const {selectedFilters} = yield select(state => state.pictureModel);
    //   const filter = payload.filter;
    //
    //   if (!selectedFilters.find(selected => selected.filter === filter)) {
    //     selectedFilters.push(payload);
    //   }
    //
    //   yield put({
    //     type: 'updateState',
    //     payload: {
    //       selectedFilters
    //     }
    //   });
    // },
    //
    // * selectFilter({payload}, {put, select}) {
    //   const {selectedFilters} = yield select(state => state.pictureModel);
    //   const filter = payload.filter;
    //
    //   if (selectedFilters.find(selected => selected.filter === filter)) {
    //     yield put({
    //       type: 'updateState',
    //       payload: {}
    //     });
    //   }
    // },
    //
    // * removeFilter({payload}, {put, select}) {
    //   let {
    //     selectedFilters,
    //     style
    //   } = yield select(state => state.pictureModel);
    //
    //   let _filter = style.filter.split(' ');
    //   const idx = findFilterIdx(style, payload);
    //
    //   if (idx > -1) {
    //     _filter.splice(idx, 1);
    //     style.filter = _filter.join(' ');
    //     selectedFilters = selectedFilters.filter(selected => selected.filter !== payload.filter);
    //
    //     yield put({
    //       type: 'cleanEntityForm',
    //       payload: {
    //         key: payload.filter,
    //         model: 'contentModel',
    //         namespace: 'picture'
    //       }
    //     });
    //   }
    //
    //   yield put({
    //     type: 'updateState',
    //     payload: {
    //       style,
    //       selectedFilters
    //     }
    //   });
    // },
    //
    // * updateFilter({payload}, {put, select, call}) {
    //   const {style} = yield select(state => state.pictureModel);
    //
    //   let _selectedFilters = yield call(handleMultipleFilters, {
    //     filterType: 'cssFilter',
    //     style,
    //     payload
    //   });
    //
    //   yield put({
    //     type: 'updateSelectedFilters',
    //     payload
    //   });
    //
    //   yield put({
    //     type: 'updateState',
    //     payload: {style: {filter: _selectedFilters}}
    //   });
    // },
    //
    // * updateTransform({payload}, {put, select}) {
    //   const {style} = yield select(state => state.pictureModel);
    //
    //   let _selectedFilters = yield call(handleMultipleFilters, {
    //     style,
    //     filterType: 'cssTransform',
    //     payload
    //   });
    //
    //   yield put({
    //     type: 'updateSelectedFilters',
    //     payload
    //   });
    //
    //   yield put({
    //     type: 'updateState',
    //     payload: {
    //       style: {
    //         transform: _selectedFilters
    //       }
    //     }
    //   });
    // },
    //
    // * updateFilterSlider({payload}, {put}) {
    //   const {props} = payload;
    //
    //   props.key = props.name;
    //   props.marks = {
    //     [props.min]: {
    //       label: `${props.min}${props.unit || ''}`
    //     },
    //     [props.max]: {
    //       label: `${props.max}${props.unit || ''}`
    //     }
    //   };
    //
    //   yield put({
    //     type: 'toForm',
    //     payload: {
    //       model: 'pictureModel',
    //       selectedFilter: props.name
    //     }
    //   });
    //
    //   yield put({
    //     type: 'updateState',
    //     payload: {
    //       sliderProps: {
    //         defaultValue: DEFAULTS[props.name],
    //         visible: true,
    //         filter: props
    //       }
    //     }
    //   });
    // }
  },

  reducers: {}
});
