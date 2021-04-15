import React from 'react';
import { withTranslation } from 'react-i18next';
import { SaveOutlined } from '@ant-design/icons';
import { Button } from 'antd';

/**
 * @export
 * @default
 * @constant
 * @param props
 * @return {JSX.Element}
 */
const closeButton = props => {
  const {
    t,
    loading,
    icon,
    disabled = false,
    size = 'small',
    type = 'default',
    onClick
  } = props;

  return (
    <Button size={size}
            disabled={disabled}
            loading={loading}
            icon={icon}
            onClick={onClick}
            type={type}>
      {t('actions:close')}
    </Button>
  );
};

export default withTranslation()(closeButton);
