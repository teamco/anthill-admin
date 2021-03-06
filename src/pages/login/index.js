import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { withTranslation } from 'react-i18next';

import { Button, Tooltip } from 'antd';
import ErrorModal from '@/components/Authentication/modals/error.modal';
import SignInModal from '@/components/Authentication/modals/signin.modal';
import SignUpModal from '@/components/Authentication/modals/signup.modal';
import Page from '@/components/Page';

/**
 * @constant
 * @param props
 * @return {JSX.Element}
 */
const login = (props) => {
  const { t, authModel, signInVisible, onQuery, onSignIn, loading } = props;

  const { currentUser, errors } = authModel;

  const [isSignInVisible, setIsSignInVisible] = useState(true);
  const [isRegisterVisible, setIsRegisterVisible] = useState(false);
  const [isErrorVisible, setIsErrorVisible] = useState(false);

  useEffect(() => {
    onQuery(currentUser);
  }, [currentUser]);

  let errorProps = {};

  if (errors) {
    errorProps = {
      title: t('error:errorNum', { number: 400 }),
      errors
    };

    if (isErrorVisible) {
      // TODO (teamco): Do something.
    } else {
      // setIsErrorVisible(true);
    }
  }

  /**
   * @constant
   */
  const handleErrorCancel = () => {
    setIsErrorVisible(false);
    // setError(null);
  };

  /**
   * @constant
   * @param signInFn
   */
  const handleCancel = (signInFn) => {
    if (typeof signInFn === 'function') {
      signInFn();
    }
  };

  /**
   * @constant
   * @param values
   */
  const onFinish = (values) => {
    onSignIn(values.email, values.password);
  };

  /**
   * @constant
   * @param provider
   * @param icon
   * @param signInFn
   * @return {JSX.Element}
   */
  const authBtn = (provider, icon, signInFn) => (
    <Tooltip title={t('auth:signInWith', { provider })}>
      <Button loading={loading}
              onClick={() => handleCancel(signInFn)}
              icon={icon}
              size={'small'}>
        {provider}
      </Button>
    </Tooltip>
  );

  const signUpProps = {
    MIN_PASSWORD_LENGTH: authModel.MIN_PASSWORD_LENGTH,
    isRegisterVisible,
    setIsRegisterVisible,
    setIsSignInVisible,
    signInVisible: true
  };

  const signInProps = {
    isSignInVisible,
    signInVisible: true,
    handleCancel,
    authModel,
    onFinish,
    loading,
    setIsSignInVisible,
    setIsRegisterVisible
  };

  return (
    <Page component={'login'}>
      <ErrorModal errorProps={errorProps}
                  isErrorVisible={isErrorVisible}
                  handleErrorCancel={handleErrorCancel} />
      <SignInModal {...signInProps} />
      <SignUpModal {...signUpProps} />
    </Page>
  );
};

export default connect(
  ({ authModel, loading }) => {
    return { authModel, loading };
  },
  (dispatch) => ({
    dispatch,
    onQuery(user) {
      dispatch({ type: 'authModel/query', payload: { user } });
    },
    onSignIn(email, password) {
      dispatch({ type: 'authModel/signIn', payload: { email, password } });
    }
  })
)(withTranslation()(login));
