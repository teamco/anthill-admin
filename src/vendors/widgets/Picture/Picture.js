import React, { Component } from 'react';
import { connect } from 'dva';
import { Image } from 'antd';
import { withTranslation } from 'react-i18next';

import PictureConfig from '@/vendors/widgets/Picture/config/picture.config';
import { fromForm } from '@/utils/object';

import styles from '@/vendors/widgets/Picture/picture.module.less';

class Picture extends Component {

  componentDidMount() {
    const { onSetProperties } = this.props;
    onSetProperties(<PictureConfig {...this.props} />);
  }

  render() {
    const {
      pictureModel
    } = this.props;

    debugger
    const { entityForm } = pictureModel;
    const imageUrl = fromForm(entityForm, 'imageUrl');

    return (
      <div className={styles.picture}>
        <Image src={imageUrl} />
      </div>
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
    onSetProperties(properties) {
      dispatch({
        type: 'pictureModel/setProperties',
        payload: { properties }
      });
    },
    onUpdateContentForm(props) {
      dispatch({
        type: 'contentModel/updateContentForm',
        payload: { props }
      });
    }
  })
)(withTranslation()(Picture));
