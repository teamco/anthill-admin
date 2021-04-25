import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Image } from 'antd';
import { withTranslation } from 'react-i18next';

import PictureConfig from '@/vendors/widgets/Picture/config/picture.config';
import { fromForm } from '@/utils/object';

import styles from '@/vendors/widgets/Picture/picture.module.less';

const Picture = props => {

  useEffect(() => {
    onDefineProps(
      <PictureConfig {...props} />,
      opts.contentKey
    );
  }, []);

  const {
    onDefineProps,
    pictureModel,
    opts
  } = props;

  const { entityForm } = pictureModel;
  const imageUrl = fromForm(entityForm, 'imageUrl');

  return (
    <div className={styles.picture}>
      <Image src={imageUrl} />
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
    onDefineProps(config, contentKey) {
      dispatch({
        type: 'pictureModel/defineProps',
        payload: { config, contentKey }
      });
    },
    onUpdateContentForm(props) {
      dispatch({
        type: 'widgetContentModel/updateContentForm',
        payload: { props }
      });
    }
  })
)(withTranslation()(Picture));
