import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { withTranslation } from 'react-i18next';
import { Form, Input, Button, Modal, Row, Col, Tooltip } from 'antd';
import {
  LockTwoTone,
  FormOutlined,
  ProfileTwoTone, LoginOutlined
} from '@ant-design/icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';

import { onUpdateMeter } from '@/components/Authentication/methods/meter';
import EmailPartial from '@/components/partials/email.partial';

import styles from '@/components/Authentication/authentication.module.less';

import Strength from '@/components/Authentication/strength';

/**
 * @constant
 * @param props
 * @return {boolean|JSX.Element}
 * @constructor
 */
const SignUpModal = props => {

  const {
    t,
    MIN_PASSWORD_LENGTH,
    isRegisterVisible,
    signInVisible,
    setIsSignInVisible,
    setIsRegisterVisible,
    onSignUp,
    loading,
    authModel
  } = props;

  const { registered } = authModel;

  const [didMount, setDidMount] = useState(false);
  const [meterValue, setMeterValue] = useState(null);
  const [meterText, setMeterText] = useState('');

  /**
   * @constant
   * @function
   */
  const handleCancel = () => {
    if (didMount) {
      setIsSignInVisible(true);
      setIsRegisterVisible(false);
    }
  };

  useEffect(() => {
    setDidMount(true);
    if (registered) {
      handleCancel();
    }

    return () => setDidMount(false);
  }, [registered]);

  /**
   * @constant
   * @param values
   */
  const onFinish = values => {
    onSignUp({
      email: values.email,
      name: values.name,
      password: values.password
    });
  };

  const modalHeader = (
    <div className={styles.modalHeader}>
      <h2>
        <FontAwesomeIcon icon={faUserCircle} />
        {t('auth:signUpTitle')}
      </h2>
      <h6>{t('auth:signUpDesc')}</h6>
    </div>
  );

  return didMount && (
    <Modal title={modalHeader}
           visible={isRegisterVisible}
           destroyOnClose={true}
           closable={!signInVisible}
           className={styles.authModal}
           centered
           maskStyle={signInVisible ? { backgroundColor: 'rgba(0, 0, 0, 0.45)' } : null}
           footer={null}>
      <Form name={'auth_signup'}
            className={styles.loginForm}
            size={'large'}
            onFinish={onFinish}>
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item name={'name'}
                       style={{ marginBottom: 0 }}
                       rules={[
                         {
                           required: true,
                           message: t('form:required', { field: t('form:displayName') })
                         }
                       ]}>
              <Input prefix={<ProfileTwoTone />}
                     autoComplete={'off'}
                     placeholder={t('form:displayName')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <EmailPartial />
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item name={'password'}
                       hasFeedback
                       extra={t('auth:passwordHelper', { length: MIN_PASSWORD_LENGTH })}
                       onChange={e => onUpdateMeter({ e, setMeterText, setMeterValue })}
                       rules={[
                         {
                           required: true,
                           message: t('form:required', { field: t('auth:password') })
                         },
                         ({ getFieldValue }) => ({
                           validator(_, value) {
                             if (value && getFieldValue('password').length < MIN_PASSWORD_LENGTH) {
                               return Promise.reject(t('auth:passwordTooEasy', { length: MIN_PASSWORD_LENGTH }));
                             }
                             return Promise.resolve();
                           }
                         })
                       ]}>
              <Input.Password prefix={<LockTwoTone />}
                              autoComplete={'new-password'}
                              placeholder={t('auth:password')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={'password_confirm'}
                       dependencies={['password']}
                       hasFeedback
                       rules={[
                         {
                           required: true,
                           message: t('form:required', { field: t('auth:passwordConfirm') })
                         },
                         ({ getFieldValue }) => ({
                           validator(_, value) {
                             if (!value || getFieldValue('password') === value) {
                               return Promise.resolve();
                             }

                             return Promise.reject(t('auth:passwordConfirmNotValid'));
                           }
                         })
                       ]}>
              <Input.Password prefix={<LockTwoTone />}
                              autoComplete={'new-password'}
                              placeholder={t('auth:passwordConfirm')} />
            </Form.Item>
          </Col>
        </Row>
        <Strength className={styles.passwordStrength}
                  meterValue={meterValue}
                  meterText={meterText} />
        <Form.Item>
          <Row gutter={[16, 16]}
               justify={'end'}
               className={styles.loginBtns}>
            <Col span={8}>
              <Tooltip title={t('auth:signInTitle')}>
                <Button type={'default'}
                        icon={<LoginOutlined />}
                        size={'default'}
                        block
                        loading={loading.effects['authModel/signUp']}
                        onClick={handleCancel}>
                  {t('auth:signIn')}
                </Button>
              </Tooltip>
            </Col>
            <Col span={8}>
              <Tooltip title={t('auth:registerTitle')}>
                <Button type={'primary'}
                        size={'default'}
                        htmlType={'submit'}
                        block
                        loading={loading.effects['authModel/signUp']}
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

export default connect(
  ({ authModel, loading }) => ({ authModel, loading }),
  (dispatch) => ({
    dispatch,
    onSignUp(user) {
      dispatch({ type: 'authModel/signUp', payload: { ...user } });
    }
  })
)(withTranslation()(SignUpModal));
