import React from 'react';
import PropTypes from 'prop-types';
import {withTranslation} from 'react-i18next';
import classnames from 'classnames';
import './loader.less';

const Loader = props => {
  const {contained, fullScreen, text = 'loading', page, sider, t} = props;
  const spinning = 'spinning' in props ? props.spinning : true;

  const loaderClassNames = classnames('loader', {
    ['hidden']: !spinning,
    ['fullScreen']: fullScreen,
    ['contained']: contained,
    ['page']: page,
    ['sider']: sider
  });

  return (
      <div className={loaderClassNames}>
        <div className={'wrapper'}>
          <div className={'inner'}/>
          <div className={'text'}>{t(text)}</div>
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