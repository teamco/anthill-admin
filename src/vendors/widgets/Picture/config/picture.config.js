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
    imageUrl,
    pictureModel,
    onUpdatePreview
  } = props;

  const {
    style,
    selectedFilters,
    sliderProps,
    entityForm
  } = pictureModel;

  return (
    <div>
      <GenericPanel header={t('panel:contentProperties')}
                    name={'content-properties'}
                    defaultActiveKey={['content-properties']}>
        {pictureProps(onUpdatePreview).map((prop, idx) => (
          <div key={idx}>{prop}</div>
        ))}
      </GenericPanel>
      <GenericPanel className={styles.pictureProperties}
                    header={t('panel:contentPropertiesFilter')}
                    name={'content-properties-filter'}
                    defaultActiveKey={['content-properties-filter']}>
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
  );
};

export default connect(({ pictureModel, loading }) => {
    return {
      pictureModel,
      loading
    };
  },
  dispatch => ({
    dispatch,
    onUpdatePreview({ target }) {
      dispatch({
        type: 'pictureModel/updatePreview',
        payload: { imageUrl: target.value }
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
        payload: { filter }
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
        payload: { props }
      });
    }
  })
)(withTranslation()(pictureConfig));
