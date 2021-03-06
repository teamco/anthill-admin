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
const saveButton = props => {
  const {
    t,
    formRef,
    loading,
    isEdit,
    disabled,
    size = 'small',
    type = 'primary'
  } = props;

  return (
    <Button size={size}
            disabled={disabled}
            loading={loading}
            icon={<SaveOutlined />}
            onClick={() => formRef.submit()}
            type={type}>
      {isEdit ? t('actions:update') : t('actions:save')}
    </Button>
  );
};

export default withTranslation()(saveButton);
