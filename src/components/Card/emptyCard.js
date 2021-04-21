import React from 'react';
import { StopOutlined } from '@ant-design/icons';
import { Card } from 'antd';

import classnames from 'classnames';
import styles from '@/components/Card/card.module.less';
import { withTranslation } from 'react-i18next';

const { Meta } = Card;

/**
 * @constant
 * @param props
 * @return {JSX.Element}
 */
const emptyCard = props => {
  const { t, instance, hoverable = true } = props;

  return (
    <Card hoverable={hoverable}
          className={classnames(styles.card, styles.empty)}
          cover={<StopOutlined />}>
      <Meta className={styles.title}
            title={t('empty:title')}
            description={t('empty:description', { instance })} />
    </Card>
  );
};

export default withTranslation()(emptyCard);
