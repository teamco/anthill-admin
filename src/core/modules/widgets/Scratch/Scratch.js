import React, {Component} from 'react';
import {connect} from 'dva';
import {withTranslation} from 'react-i18next';

import Form from '@/components/Form';
import {scratchProperties} from '@/core/modules/widgets/Scratch/src/scratch.properties';

const {GenericPanel} = Form;

class Scratch extends Component {

  properties() {
    const {
      scratchModel,
      t
    } = this.props;

    const {
    } = scratchModel;

    return (
        <div>
          <GenericPanel header={t('panel:contentProperties')}
                        name={'widget-content-properties'}
                        defaultActiveKey={['widget-content-properties']}>
            {scratchProperties().map((prop, idx) => (
                <div key={idx}>{prop}</div>
            ))}
          </GenericPanel>
        </div>
    );
  }

  componentDidMount() {
    const {onSetProperties} = this.props;
    onSetProperties(this.properties());
  }

  render() {
    return (
        <div style={{padding: 20}}>Embedded content</div>
    );
  }
}

export default connect(({
      scratchModel,
      loading
    }) => {
      return {
        scratchModel,
        loading
      };
    },
    dispatch => ({
      dispatch,
      onSetProperties(properties) {
        dispatch({
          type: 'scratchModel/setProperties',
          payload: {properties}
        });
      }
    })
)(withTranslation()(Scratch));
