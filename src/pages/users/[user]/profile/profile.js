import React, { useEffect } from 'react';
import { connect } from 'dva';
import { useParams } from 'umi';
import { withTranslation } from 'react-i18next';

import Page from '@/components/Page';
import Users from '@/pages/users';
import Websites from '@/pages/users/[user]/websites';

import styles from '@/pages/users/[user]/profile/profile.module.less';
import userStyles from '@/pages/users/users.module.less';

const profile = (props) => {
  const {
    t,
    authModel,
    userModel,
    loading,
    onGetUser
  } = props;

  const params = useParams();

  const { selectedUser } = userModel;

  useEffect(() => {
    onGetUser(params.user);
  }, []);

  const { ability } = authModel;
  const component = 'profile';
  // const disabled = !ability.can('update', component);

  return (
    <Page className={userStyles.users}
          component={component}
          spinEffects={['userModel/getUser']}>
      <Users profiled={true} />
      <Websites />
    </Page>
  );
};

export default connect(
  ({ authModel, userModel, loading }) => {
    return {
      authModel,
      userModel,
      loading
    };
  },
  (dispatch) => ({
    dispatch,
    onGetUser(key) {
      dispatch({ type: 'userModel/getUser', payload: { userKey: key } });
    }
  })
)(withTranslation()(profile));
