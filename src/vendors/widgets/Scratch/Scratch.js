import React, { Component } from 'react';
import { connect } from 'dva';
import { withTranslation } from 'react-i18next';

import ScratchConfig from '@/vendors/widgets/Scratch/config/scratch.config';

class Scratch extends Component {

  componentDidMount() {
    const { onSetProperties } = this.props;
    onSetProperties(<ScratchConfig />);
  }

  render() {
    return (
      <div style={{ padding: 20 }}>Embedded content</div>
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
    onSetProperties(config) {
      dispatch({ type: 'scratchModel/setProperties', payload: { config } });
    }
  })
)(withTranslation()(Scratch));
