import React, {Component} from 'react';
import {connect} from 'dva';
import {Image} from 'antd';
import {withTranslation} from 'react-i18next';

import Form from '@/components/Form';
import {fromForm} from '@/utils/state';
import {pictureFilterProperties, pictureProperties} from './src/picture.properties';

import styles from './picture.module.less';

const {GenericPanel} = Form;

class Picture extends Component {

  properties() {
    const {
      pictureModel,
      onUpdatePreview,
      onUpdateFilter,
      onRemoveFilter,
      onUpdateContentForm,
      onUpdateTransform,
      onUpdateFilterSlider,
      t
    } = this.props;

    const {
      style,
      selectedFilters,
      sliderProps,
      entityForm
    } = pictureModel;

    const {pictureImageUrlPreview} = fromForm(entityForm);

    return pictureImageUrlPreview ? (
        <div>
          <GenericPanel header={t('panel:contentProperties')}
                        name={'widget-content-properties'}
                        defaultActiveKey={['widget-content-properties']}>
            {pictureProperties(onUpdatePreview).map((prop, idx) => (
                <div key={idx}>{prop}</div>
            ))}
          </GenericPanel>
          <GenericPanel className={styles.pictureProperties}
                        header={t('panel:contentPropertiesFilter')}
                        name={'widget-content-properties-filter'}
                        defaultActiveKey={['widget-content-properties-filter']}>
            {pictureFilterProperties({
              onUpdateFilterSlider,
              onUpdateFilter,
              onUpdateTransform,
              onRemoveFilter,
              onUpdateContentForm,
              selectedFilters,
              pictureImageUrlPreview,
              style,
              entityForm,
              sliderProps
            }).map((prop, idx) => (
                <div key={idx}>{prop}</div>
            ))}
          </GenericPanel>
        </div>
    ) : null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {pictureModel, onSetProperties} = this.props;
    const _isChanged = JSON.stringify(prevProps.pictureModel) !== JSON.stringify(pictureModel);

    if (_isChanged) {
      onSetProperties(this.properties());
    }
  }

  componentDidMount() {
    const {onSetProperties} = this.props;
    onSetProperties(this.properties());
  }

  render() {
    const {
      pictureModel
    } = this.props;

    const {entityForm} = pictureModel;
    const {pictureImageUrlPreview} = fromForm(entityForm);

    return (
        <Image width={'100%'}
               height={'100%'}
               src={pictureImageUrlPreview}/>
    );
  }
}

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
          payload: {
            filter,
            value,
            unit
          }
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
          payload: {
            filter,
            value,
            unit
          }
        });
      },
      onSetProperties(properties) {
        dispatch({
          type: 'pictureModel/setProperties',
          payload: {properties}
        });
      },
      onUpdateFilterSlider(props) {
        dispatch({
          type: 'pictureModel/updateFilterSlider',
          payload: {props}
        });
      },
      onUpdateContentForm(props) {
        dispatch({
          type: 'contentModel/updateContentForm',
          payload: {props}
        });
      }
    })
)(withTranslation()(Picture));
