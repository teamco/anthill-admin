/**
 * @type {Function}
 */
import modelExtend from 'dva-model-extend';
import { widgetCommonModel } from '@/models/widget.common.model';

import { fromForm } from '@/utils/object';
import {
  findFilterIdx,
  handleMultipleFilters,
  removeFilter,
  findFilter
} from '@/vendors/widgets/Picture/services/picture.service';

const DEFAULT_VALUES = {
  picture: {
    alt: '',
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
  state: { ...DEFAULT_STATE },

  subscriptions: {
    setup({ dispatch }) {
    }
  },

  effects: {

    * defineProps({ payload }, { put, select }) {
      const { entityForm } = yield select(state => state.widgetContentModel);
      const { config, contentKey } = payload;

      yield put({
        type: 'widgetContentModel/setContentConfig',
        payload: {
          config,
          contentKey,
          defaultValues: { ...DEFAULT_VALUES },
          model: `pictureModel`
        }
      });

      yield put({
        type: 'updatePreview',
        payload: {
          imageUrl: fromForm(entityForm, 'imageUrl') ||
            DEFAULT_VALUES.picture.imageUrl
        }
      });
    },

    * updatePreview({ payload }, { put }) {
      yield put({
        type: 'toForm',
        payload: {
          model: 'widgetContentModel',
          form: { setting: { picture: { imageUrl: payload.imageUrl } } }
        }
      });
    },

    * updateSelectedFilters({ payload }, { call, put, select }) {
      const { selectedFilters } = yield select(state => state.pictureModel);
      const _selectedFilters = [...selectedFilters];

      const { filter } = payload;
      const _selected = yield call(findFilter, { selectedFilters, filter });

      if (!_selected) {
        _selectedFilters.push(payload);
      }

      yield put({
        type: 'updateState',
        payload: { selectedFilters: _selectedFilters }
      });
    },

    * updateSliderProps({ payload }, { put }) {
      const { props, value, visible = true } = payload;

      yield put({
        type: 'updateState',
        payload: {
          sliderProps: {
            visible,
            filter: props,
            defaultValue: value || DEFAULT_VALUES.picture[props.name] || 0
          }
        }
      });
    },

    * selectFilter({ payload }, { call, put, select }) {
      const { selectedFilters } = yield select(state => state.pictureModel);
      const { props, selected } = payload;

      const _selected = yield call(findFilter, { selectedFilters, filter: selected.filter });

      if (_selected) {
        yield put({
          type: 'toForm',
          payload: {
            model: 'widgetContentModel',
            form: { selectedFilter: selected.filter }
          }
        });

        yield put({
          type: 'updateSliderProps',
          payload: { props, value: selected.value }
        });
      }
    },

    * removeFilter({ payload }, { call, put, select }) {
      let { selectedFilters, style } = yield select(state => state.pictureModel);
      let _selectedFilters = [...selectedFilters];
      let _style = { ...style };

      const { props, selected } = payload;

      let _filter = style.filter.split(' ');
      const idx = yield call(findFilterIdx, { style, filter: selected.filter });

      if (idx > -1) {
        _filter.splice(idx, 1);
        _style.filter = _filter.join(' ');
        _selectedFilters = yield call(removeFilter, { selectedFilters, filter: selected.filter });
      }

      yield put({
        type: 'updateState',
        payload: {
          style: _style,
          selectedFilters: _selectedFilters
        }
      });

      yield put({
        type: 'toForm',
        payload: {
          model: 'widgetContentModel',
          form: { selectedFilter: null }
        }
      });

      yield put({ type: 'updateSliderProps', payload: { props } });
    },

    * updateFilter({ payload }, { put, select, call }) {
      const { style } = yield select(state => state.pictureModel);

      let _selectedFilters = yield call(handleMultipleFilters, {
        filterType: 'cssFilter',
        style,
        payload
      });

      yield put({ type: 'updateSelectedFilters', payload });

      yield put({
        type: 'updateState',
        payload: { style: { filter: _selectedFilters } }
      });
    },

    * updateTransform({ payload }, { call, put, select }) {
      const { style } = yield select(state => state.pictureModel);

      let _selectedFilters = yield call(handleMultipleFilters, {
        style,
        filterType: 'cssTransform',
        payload
      });

      yield put({ type: 'updateSelectedFilters', payload });

      yield put({
        type: 'updateState',
        payload: { style: { transform: _selectedFilters } }
      });
    },

    * updateFilterSlider({ payload }, { put }) {
      const { props } = payload;

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
          model: 'widgetContentModel',
          form: { selectedFilter: props.name }
        }
      });

      yield put({ type: 'updateSliderProps', payload: { props } });
    }
  },

  reducers: {}
});
