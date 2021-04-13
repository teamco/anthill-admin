import React from 'react';
import { Button, Col, Divider, Form, Input, Modal, Row, Tooltip } from 'antd';
import { FormOutlined, LockTwoTone, LoginOutlined } from '@ant-design/icons';

import { emailPartial } from '@/components/partials/email.partial';

import styles from '@/components/Authentication/authentication.module.less';

/**
 * @constant
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const SignInModal = (props) => {
  const {
    t,
    isSignInVisible,
    signInVisible,
    closable,
    handleCancel,
    authModel,
    onFinish,
    loading,
    setIsSignInVisible,
    setIsRegisterVisible
  } = props;

  const modalHeader = (
    <div className={styles.modalHeader}>
      <h4>{t('auth:signInTitle')}</h4>
      <h6>{t('auth:signInDesc')}</h6>
    </div>
  );

  return (
    <Modal title={modalHeader}
           destroyOnClose={true}
           visible={isSignInVisible}
           closable={closable || !signInVisible}
           onCancel={handleCancel}
           className={styles.authModal}
           width={350}
           centered
           maskStyle={
             signInVisible ? { backgroundColor: 'rgba(0, 0, 0, 0.45)' } : null
           }
           footer={null}>
      <Form name={'auth_login'}
            className={styles.loginForm}
            size={'large'}
            onFinish={onFinish}>
        {emailPartial({ t, name: 'email' })}
        <Form.Item name={'password'}
                   extra={t('auth:passwordHelper', {
                     length: authModel.MIN_PASSWORD_LENGTH
                   })}
                   rules={[
                     {
                       required: true,
                       message: t('form:required', { field: t('auth:password') })
                     }
                   ]}>
          <Input.Password prefix={<LockTwoTone />}
                          placeholder={t('auth:password')} />
        </Form.Item>
        <Form.Item>
          <Row gutter={[16, 16]}
               justify={'center'}
               className={styles.loginBtns}>
            <Col span={10}>
              <Tooltip title={t('auth:signInTitle')}>
                <Button type={'primary'}
                        htmlType={'submit'}
                        icon={<LoginOutlined />}
                        size={'default'}
                        block
                        loading={loading}>
                  {t('auth:signIn')}
                </Button>
              </Tooltip>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SignInModal;
