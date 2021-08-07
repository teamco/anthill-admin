import React from 'react';
import { Image, Input, Select, Slider, Tag, Tooltip } from 'antd';

import i18n from '@/utils/i18n';
import { Html5Outlined } from '@ant-design/icons';

import styles from '@/vendors/widgets/Picture/picture.module.less';
import { fromForm } from '@/utils/object';
import { findFilter } from '@/vendors/widgets/Picture/services/picture.service';

const { TextArea } = Input;
const { Option } = Select;

export const pictureProps = (onUpdatePreview) => {
  return [
    [
      (
        <Input type={'text'}
               label={i18n.t('form:alt')}
               name={'alt'}
               key={'picture.alt'} />
      )
    ],
    [
      (
        <TextArea label={i18n.t('form:imgUrl')}
                  name={'imageUrl'}
                  key={'picture.imageUrl'}
                  onChange={onUpdatePreview}
                  autoSize={{
                    minRows: 4,
                    maxRows: 10
                  }}
                  type={'textarea'} />
      )
    ]
  ];
};

/**
 * @export
 * @param onUpdateFilter
 * @param onUpdateFilterSlider
 * @param onUpdateTransform
 * @param onUpdateContentForm
 * @param onRemoveFilter
 * @param [style]
 * @param [selectedFilters]
 * @param entityForm
 * @param sliderProps
 * @return {JSX.Element[][]}
 */
export const filterProps = ({
  onUpdateFilter,
  onUpdateFilterSlider,
  onUpdateTransform,
  onRemoveFilter,
  onSelectFilter,
  entityForm,
  sliderProps,
  selectedFilters = [],
  style = {}
}) => {

  const { picture } = fromForm(entityForm, 'setting');
  const imageUrl = picture?.imageUrl;

  /**
   * @constant
   * @param {string} name
   * @return {*}
   */
  const handleChangeFilter = name => {
    const props = sliders[name];
    props.className = styles.filterSlider;
    onUpdateFilterSlider(props);

    return props;
  };

  /**
   * @constant
   * @param {{filter, value}} selected
   */
  const handleSelectFilter = (selected) => {
    const props = handleChangeFilter(selected.filter);
    onSelectFilter(props, selected);
  };

  /**
   * @constant
   * @param {{filter, value}} selected
   */
  const handleRemoveFilter = (selected) => {
    const props = handleChangeFilter(selected.filter);
    onRemoveFilter(props, selected);
  };

  const sliders = {
    blur: {
      label: i18n.t('filter:blur'),
      name: 'blur',
      tipFormatter: value => `${i18n.t('filter:blurRadius')}: ${value}px`,
      onAfterChange: value => onUpdateFilter('blur', value, 'px'),
      unit: 'px',
      min: 0,
      max: 100,
      step: 1
    },
    scaleX: {
      label: i18n.t('filter:scaleHorizontal'),
      name: 'scaleX',
      onAfterChange: value => onUpdateTransform('scaleX', value),
      min: -10,
      max: 10,
      step: 0.1
    },
    scaleY: {
      label: i18n.t('filter:scaleVertical'),
      name: 'scaleY',
      onAfterChange: value => onUpdateTransform('scaleY', value),
      min: -10,
      max: 10,
      step: 0.1
    },
    brightness: {
      label: i18n.t('filter:brightness'),
      name: 'brightness',
      onAfterChange: value => onUpdateFilter('brightness', value),
      min: 0.1,
      max: 10,
      step: 0.1
    },
    contrast: {
      label: i18n.t('filter:contrast'),
      name: 'contrast',
      onAfterChange: value => onUpdateFilter('contrast', value),
      min: 0.1,
      max: 10,
      step: 0.1
    },
    grayscale: {
      label: i18n.t('filter:grayscale'),
      name: 'grayscale',
      onAfterChange: value => onUpdateFilter('grayscale', value),
      min: 0.1,
      max: 1,
      step: 0.01
    },
    'hue-rotate': {
      label: i18n.t('filter:hueRotate'),
      name: 'hue-rotate',
      tipFormatter: value => `${i18n.t('filter:angle')}: ${value}deg`,
      onAfterChange: value => onUpdateFilter('hue-rotate', value, 'deg'),
      unit: 'deg',
      min: 0,
      max: 360,
      step: 1
    },
    scale: {
      label: i18n.t('filter:scale'),
      name: 'zoom',
      onAfterChange: value => onUpdateTransform('scale', value, 'deg'),
      unit: 'deg',
      min: -10,
      max: 10,
      step: 0.1
    },
    invert: {
      label: i18n.t('filter:invert'),
      name: 'invert',
      onAfterChange: value => onUpdateFilter('invert', value),
      min: 0.1,
      max: 1,
      step: 0.01
    },
    saturate: {
      label: i18n.t('filter:saturate'),
      name: 'saturate',
      onAfterChange: value => onUpdateFilter('saturate', value),
      min: 0.1,
      max: 10,
      step: 0.1
    },
    sepia: {
      label: i18n.t('filter:sepia'),
      name: 'sepia',
      onAfterChange: value => onUpdateFilter('sepia', value),
      min: 0.1,
      max: 1,
      step: 0.01
    },
    opacity: {
      label: i18n.t('filter:opacity'),
      name: 'opacity',
      tipFormatter: value => `${value}%`,
      onAfterChange: value => onUpdateFilter('opacity', value, '%'),
      unit: '%',
      min: 0,
      max: 100,
      step: 1
    }
  };

  return [
    [
      (
        <Select label={i18n.t('filter:filter')}
                key={'selectedFilter'}
                name={'selectedFilter'}
                placeholder={i18n.t('form:placeholder', { field: '$t(filter:filter)' })}
                onChange={handleChangeFilter}
                style={{ width: '100%' }}>
          {Object.keys(sliders).sort().map(slider => {
            const _filter = sliders[slider];
            return (
              <Option key={_filter.name}
                      disabled={!!findFilter({
                        selectedFilters,
                        filter: _filter.name
                      })}
                      value={_filter.name}>
                {_filter.label}
              </Option>
            );
          })}
        </Select>
      ),
      (
        <Image label={i18n.t('form:preview')}
               key={'imageUrl'}
               width={'100%'}
               height={'100%'}
               style={style}
               src={imageUrl} />
      )
    ],
    [
      (
        <Slider disabled={!sliderProps.visible}
                key={'active-filter'}
                {...sliderProps.filter} />
      ),
      (
        <div label={i18n.t('filter:selectedFilters')}
             key={'selected-filters'}>
          {selectedFilters.map(selected => {
            return (
              <Tag onClose={() => handleRemoveFilter(selected)}
                   className={styles.filterTag}
                   icon={<Html5Outlined />}
                   color={'success'}
                   closable
                   key={selected.filter}>
                <Tooltip title={`${selected.value}${selected.unit}`}>
                  <span style={{ cursor: 'pointer' }}
                        onClick={() => handleSelectFilter(selected)}>
                    {selected.filter}
                  </span>
                </Tooltip>
              </Tag>
            );
          })}
        </div>
      )
    ]
  ];
};

// imageRepeatX
// imageRepeatY
// imageStretch
// imageSplitContent
// imageScaleHorizontal
// imageScaleVertical
// imageSaturate
// imageSepia
// imageDropShadow
// imageZoom
// imageRotate
// imageSkewY
// imageSkewX

//
//
// , imageSaturate: { type: 'range', disabled:
// true, visible: true, value: 1, min: 0.1, max: 10, step: 0.1, unit: '', monitor: {
// events: 'update.preview', callback: 'updatePreview' } }, imageSepia: { type:
// 'range', disabled: true, visible: true, value: 0.1, min: 0.1, max: 1, step: 0.01,
// unit: '', monitor: { events: 'update.preview', callback: 'updatePreview' } },
// imageDropShadow: { type: 'range', disabled: true, visible: true, value: 0, min: 0,
// max: 50, step: 1, unit: 'px', monitor: { events: 'update.preview', callback:
// 'updatePreview' } }, imageBorder: { type: 'range', disabled: true, visible: true,
// value: 0, min: 0, max: 20, step: 0.01, unit: 'rem', monitor: { events:
// 'update.preview', callback: 'updatePreview' } }, imageRadius: { type: 'range',
// disabled: true, visible: true, value: 0, min: 0, max: 50, step: 0.05, unit: '%',
// monitor: { events: 'update.preview', callback: 'updatePreview' } }, imageZoom: { type: 'range', disabled: true,
// visible: true, value: 100, min: 1, max: 200, step: 0.1, unit: '%', monitor: { events: 'update.preview', callback:
// 'updatePreview' } }, imageRotate: { type: 'range', disabled: true, visible: true, value: 0, min: -360, max: 360,
// step: 1, unit: 'deg', monitor: { events: 'update.preview', callback: 'updatePreview' } }, imageSkewY: { type:
// 'range', disabled: true, visible: true, value: 0, min: -100, max: 100, step: 1, unit: 'deg', monitor: { events:
// 'update.preview', callback: 'updatePreview' } }, imageSkewX: { type: 'range', disabled: true, visible: true,
// value: 0, min: -100, max: 100, step: 1, unit: 'deg', monitor: { events: 'update.preview', callback:
// 'updatePreview' } } };
