import React from 'react';
import { MailTwoTone } from '@ant-design/icons';
import { Form, Input } from 'antd';

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
 * @param t
 * @param name
 * @param className
 * @param emailRef
 * @param helper
 * @return {JSX.Element}
 */
export const emailPartial = ({ t, name, className, emailRef, helper = true }) => {
  return (
    <Form.Item name={name}
               className={className}
               {...emailProps(t, helper)}>
      <Input prefix={<MailTwoTone />}
             ref={emailRef}
             placeholder={t('auth:email')} />
    </Form.Item>
  );
};
