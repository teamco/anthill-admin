import React from 'react';
import { withTranslation } from 'react-i18next';
import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import i18n from '@/utils/i18n';

/**
 * @export
 * @default
 * @constant
 * @param props
 * @return {JSX.Element}
 */
const deleteButton = props => {
  const {
    t,
    loading,
    icon = <DeleteOutlined />,
    disabled = false,
    size = 'small',
    type = 'primary',
    onClick
  } = props;

  return (
    <Popconfirm title={i18n.t('msg:deleteConfirm', { instance })}
                key={'delete-confirm'}
                placement={'bottomRight'}
                onConfirm={onClick}
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
      <Button danger
              size={size}
              disabled={disabled}
              loading={loading}
              icon={icon}
              type={type}>
        {t('actions:delete')}
      </Button>
    </Popconfirm>
  );
};

export default withTranslation()(deleteButton);
