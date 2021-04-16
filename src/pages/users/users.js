import React, { useEffect } from 'react';
import { connect } from 'dva';
import { PageHeader, message } from 'antd';
import {
  UserSwitchOutlined,
} from '@ant-design/icons';
import { withTranslation } from 'react-i18next';

import Page from '@/components/Page';
import Main from '@/components/Main';

import { metadata } from '@/pages/users/users.metadata';
import i18n from '@/utils/i18n';
import { profileMetadata } from '@/pages/users/[user]/profile/profile.metadata';

import styles from '@/pages/users/users.module.less';

const { Table } = Main;

/**
 * @constant
 * @param props
 * @return {JSX.Element}
 */
const users = (props) => {
  const {
    t,
    authModel,
    userModel,
    loading,
    onQuery,
    onDeleteUser,
    onSignOutUser,
    onUnlockUser,
    onLockUser
  } = props;

  let { user } = userModel;

  useEffect(() => {
    onQuery();
  }, []);

  const tableProps = user ? profileMetadata(t) : {};

  const subTitle = (
    <>
      <UserSwitchOutlined style={{ marginRight: 10 }} />
      {t('actions:manage', { type: t('auth:users') })}
    </>
  );

  const { ability } = authModel;
  const component = 'users';
  // const disabled = !ability.can('update', component);

  return (
    <Page className={styles.users}
          component={component}
          spinEffects={['authModel/defineAbilities']}>
      <PageHeader ghost={false} subTitle={subTitle} />
      <div className={styles.grid}>
        <Table data={userModel.users}
               {...tableProps}
               {...metadata({
                 t,
                 data: userModel.users,
                 list: !user,
                 loading,
                 currentUser: authModel.user,
                 onDeleteUser,
                 onSignOutUser,
                 onUnlockUser,
                 onLockUser
               })} />
      </div>
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
    onQuery() {
      dispatch({ type: `userModel/query` });
    },
    onDeleteUser(user) {
      dispatch({ type: `userModel/delete`, payload: { user } });
    },
    onSignOutUser(user) {
      dispatch({ type: `userModel/signOutUser`, payload: { user } });
    },
    onLockUser(user) {
      dispatch({ type: `userModel/lock`, payload: { user } });
    },
    onUnlockUser(user) {
      dispatch({ type: `userModel/unlock`, payload: { user } });
    }
  })
)(withTranslation()(users));
