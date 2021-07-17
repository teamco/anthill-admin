import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import classnames from 'classnames';
import styles from './loader.less';

const Loader = props => {
  const { contained, fullScreen, text = 'loading', page, sider, t } = props;
  const spinning = 'spinning' in props ? props.spinning : true;

  const loaderClassNames = classnames(styles.loader, {
    [styles.hidden]: !spinning,
    [styles.fullScreen]: fullScreen,
    [styles.contained]: contained,
    [styles.page]: page,
    [styles.sider]: sider
  });

  return (
    <div className={loaderClassNames}>
      <div className={styles.wrapper}>
        <div className={styles.inner} />
        <div className={styles.text}>{t(text)}</div>
      </div>
    </div>
  );
};

Loader.propTypes = {
  spinning: PropTypes.bool,
  fullScreen: PropTypes.bool
};

Loader.displayName = 'Loader';

export default withTranslation()(Loader);
