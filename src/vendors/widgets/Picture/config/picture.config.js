import React from 'react';
import { connect } from 'dva';
import { withTranslation } from 'react-i18next';

import Form from '@/components/Form';

import {
  filterProps,
  pictureProps
} from '@/vendors/widgets/Picture/config/picture.properties';

import styles from '@/vendors/widgets/Picture/picture.module.less';

const { GenericPanel } = Form;

/**
 * @export
 * @default
 * @param props
 * @return {JSX.Element}
 */
const pictureConfig = props => {
  const {
    t,
    pictureImageUrlPreview,
    pictureModel,
    onUpdatePreview
  } = props;

  const {
    style,
    selectedFilters,
    sliderProps,
    entityForm
  } = pictureModel;

  return pictureImageUrlPreview ? (
    <div>
      <GenericPanel header={t('panel:contentProperties')}
                    name={'widget-content-properties'}
                    defaultActiveKey={['widget-content-properties']}>
        {pictureProps(onUpdatePreview).map((prop, idx) => (
          <div key={idx}>{prop}</div>
        ))}
      </GenericPanel>
      <GenericPanel className={styles.pictureProperties}
                    header={t('panel:contentPropertiesFilter')}
                    name={'widget-content-properties-filter'}
                    defaultActiveKey={['widget-content-properties-filter']}>
        {filterProps({
          ...props,
          selectedFilters,
          style,
          entityForm,
          sliderProps
        }).map((prop, idx) => (
          <div key={idx}>{prop}</div>
        ))}
      </GenericPanel>
    </div>
  ) : null;
};

export default connect(({
    pictureModel,
    loading
  }) => {
    return {
      pictureModel,
      loading
    };
  },
  dispatch => ({
    dispatch,
    onUpdatePreview({target}) {
      dispatch({
        type: 'pictureModel/updatePreview',
        payload: {pictureImageUrlPreview: target.value}
      });
    },
    onUpdateFilter(filter, value, unit = '') {
      dispatch({
        type: 'pictureModel/updateFilter',
        payload: { filter, value, unit }
      });
    },
    onRemoveFilter(filter) {
      dispatch({
        type: 'pictureModel/removeFilter',
        payload: {filter}
      });
    },
    onUpdateTransform(filter, value, unit = '') {
      dispatch({
        type: 'pictureModel/updateTransform',
        payload: { filter, value, unit }
      });
    },
    onUpdateFilterSlider(props) {
      dispatch({
        type: 'pictureModel/updateFilterSlider',
        payload: {props}
      });
    }
  })
)(withTranslation()(pictureConfig));
