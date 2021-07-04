import React from 'react';
import { MailTwoTone } from '@ant-design/icons';
import { Form, Input } from 'antd';
import { withTranslation } from 'react-i18next';

/**
 * @export
 * @param t
 * @param {boolean} helper
 * @return {{extra, rules: [{type: string, message: *}, {message: *, required: boolean}]}}
 */
export const emailProps = (t, helper) => ({
  extra: helper ? t('auth:emailHelper') : null,
  rules: [
    { type: 'email', message: t('auth:emailNotValid') },
    { required: true, message: t('form:required', { field: t('auth:email') }) }
  ]
});

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
const emailPartial = (props) => {
  const {
    t,
    name = 'email',
    className,
    emailRef,
    helper = true,
    autoComplete = 'off'
  } = props;

  return (
    <Form.Item name={name}
               className={className}
               {...emailProps(t, helper)}>
      <Input prefix={<MailTwoTone />}
             ref={emailRef}
             autoComplete={autoComplete}
             placeholder={t('auth:email')} />
    </Form.Item>
  );
};

export default withTranslation()(emailPartial);
