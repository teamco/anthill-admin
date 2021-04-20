import React from 'react';
import { withTranslation } from 'react-i18next';
import { PlusSquareOutlined } from '@ant-design/icons';
import { Button } from 'antd';

/**
 * @export
 * @default
 * @constant
 * @param props
 * @return {JSX.Element}
 */
const newButton = props => {
  const {
    t,
    loading,
    icon = <PlusSquareOutlined />,
    disabled = false,
    size = 'small',
    type = 'primary',
    onClick
  } = props;

  return (

    <Button size={size}
            disabled={disabled}
            loading={loading}
            icon={icon}
            onClick={onClick}
            type={type}>
      {t('actions:new')}
    </Button>
  );
};

export default withTranslation()(newButton);
