import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Image } from 'antd';
import { withTranslation } from 'react-i18next';

import PictureConfig from '@/vendors/widgets/Picture/config/picture.config';
import { fromForm } from '@/utils/object';

import styles from '@/vendors/widgets/Picture/picture.module.less';

const Picture = props => {

  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    onDefineProps(
      <PictureConfig {...props} />,
      opts.contentKey
    );
  }, []);

  const {
    onDefineProps,
    pictureModel,
    widgetContentModel,
    opts
  } = props;

  const { entityForm } = widgetContentModel;

  useEffect(() => {
    const setting = fromForm(entityForm, 'setting');

    if (setting?.picture?.imageUrl) {
      setImageUrl(setting?.picture?.imageUrl);
    }
  }, [entityForm]);

  return (
    <div className={styles.picture}>
      <Image src={imageUrl} />
    </div>
  );
};

export default connect(({
    pictureModel,
    widgetContentModel,
    loading
  }) => ({
    pictureModel,
    widgetContentModel,
    loading
  }),
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
