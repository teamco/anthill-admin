import React from 'react';
import { Button, Col, Form, Input, Modal, Row, Tooltip } from 'antd';
import { FormOutlined, LockTwoTone, LoginOutlined } from '@ant-design/icons';

import { withTranslation } from 'react-i18next';
import { emailPartial } from '@/components/partials/email.partial';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';

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
      <h2>
        <FontAwesomeIcon icon={faUserCircle} />
        {t('auth:signInDesc')}
      </h2>
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
        {emailPartial({ t, name: 'email', helper: false })}
        <Form.Item name={'password'}
                   style={{marginTop: 20}}
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
            <Col span={10}>
              <Tooltip title={t('auth:registerTitle')}>
                <Button type={'default'}
                        size={'default'}
                        block
                        onClick={() => handleCancel(() => {
                          setIsSignInVisible(false);
                          setIsRegisterVisible(true);
                        })}
                        loading={loading}
                        icon={<FormOutlined />}>
                  {t('auth:register')}
                </Button>
              </Tooltip>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default withTranslation()(SignInModal);
