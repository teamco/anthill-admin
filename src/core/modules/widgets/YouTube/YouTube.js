import React, {Component} from 'react';
import {connect} from 'dva';
import {withTranslation} from 'react-i18next';

import Form from '@/components/Form';
import {youtubeProperties} from './src/youtube.properties';
import {fromForm} from '@/utils/state';
import i18n from '@/utils/i18n';
import Iframe from '@/components/Iframe';

const {GenericPanel} = Form;

class YouTube extends Component {

  properties() {
    const {
      t,
      onUpdatePreview,
      youtubeModel,
      disabledUrl = true
    } = this.props;

    let {youtubePreview} = youtubeModel;
    if (!youtubePreview) {
      youtubePreview = {...fromForm(youtubeModel.entityForm)}.youtubeSrc;
    }

    return youtubePreview ? (
        <div>
          <GenericPanel header={t('panel:contentProperties')}
                        name={'widget-content-properties'}
                        defaultActiveKey={['widget-content-properties']}>
            {youtubeProperties(onUpdatePreview, youtubePreview, disabledUrl).map((prop, idx) => (
                <div key={idx}>{prop}</div>
            ))}
          </GenericPanel>
        </div>
    ) : null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {youtubeModel, embedUrl, onSetProperties} = this.props;
    const _isChanged = JSON.stringify(prevProps.youtubeModel) !== JSON.stringify(youtubeModel);

    if (_isChanged) {
      onSetProperties(this.properties(), embedUrl);
    }
  }

  componentDidMount() {
    const {onSetProperties, embedUrl} = this.props;
    onSetProperties(this.properties(), embedUrl);
  }

  render() {
    const {
      youtubeModel
    } = this.props;

    const {youtubeSrc} = fromForm(youtubeModel.entityForm);

    return (
        <Iframe label={i18n.t('form:preview')}
                height={'100%'}
                key={'youtubePreview'}
                src={youtubeSrc}/>
    );
  }
}

export default connect(({
      youtubeModel,
      loading
    }) => {
      return {
        youtubeModel,
        loading
      };
    },
    dispatch => ({
      dispatch,
      onUpdatePreview({target}) {
        dispatch({
          type: 'youtubeModel/updatePreview',
          payload: {
            youtubePreview: target.value
          }
        });
      },
      onSetProperties(properties, embedUrl) {
        dispatch({
          type: 'youtubeModel/setProperties',
          payload: {
            properties,
            embedUrl
          }
        });
      }
    })
)(withTranslation()(YouTube));
