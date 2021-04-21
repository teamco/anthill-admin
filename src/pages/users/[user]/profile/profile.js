import React, { useEffect } from 'react';
import { connect } from 'dva';
import { useParams, history } from 'umi';
import { withTranslation } from 'react-i18next';
import { Card, Divider, Statistic } from 'antd';
import {
  GlobalOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import classnames from 'classnames';

import AntHillRow from '@/components/Grid/AntHillRow';
import Page from '@/components/Page';
import Users from '@/pages/users';

import styles from '@/pages/users/[user]/profile/profile.module.less';
import userStyles from '@/pages/users/users.module.less';

const profile = (props) => {
  const {
    t,
    authModel,
    userModel,
    websiteModel,
    loading,
    onGetUser,
    onWebsitesQuery,
    onShowWebsites
  } = props;

  const { websites } = websiteModel;

  const { user } = useParams();

  const { selectedUser } = userModel;

  useEffect(() => {
    onGetUser(user);
    onWebsitesQuery(user);
  }, []);

  const { ability } = authModel;
  const component = 'profile';
  // const disabled = !ability.can('update', component);

  return (
    <Page className={userStyles.users}
          component={component}
          spinEffects={[
            'userModel/getUser',
            'websiteModel/websitesQuery'
          ]}>
      <Users profiled={true} />
      <div className={styles.userCardWrapper}>
        <AntHillRow>
          <Card className={classnames(styles.userCard, styles.websites)}
                hoverable
                onClick={() => onShowWebsites(user)}>
            <Statistic title={websites.length || '0'}
                       value={t('menu:websites')}
                       prefix={<GlobalOutlined />} />
          </Card>
          <Card className={classnames(styles.userCard, styles.widgets)}
                hoverable
                onClick={() => onShowWebsites(user)}>
            <Statistic title={'0'}
                       value={t('menu:widgets')}
                       prefix={<AppstoreOutlined />} />
          </Card>
          <></>
        </AntHillRow>
      </div>
    </Page>
  );
};

export default connect(
  ({ authModel, websiteModel, userModel, loading }) => {
    return {
      authModel,
      websiteModel,
      userModel,
      loading
    };
  },
  (dispatch) => ({
    dispatch,
    onGetUser(userKey) {
      dispatch({ type: 'userModel/getUser', payload: { userKey } });
    },
    onShowWebsites(userKey) {
      history.push(`/accounts/${userKey}/websites`);
    },
    onWebsitesQuery(userKey) {
      dispatch({ type: 'websiteModel/websitesQuery', payload: { userKey } });
    }
  })
)(withTranslation()(profile));
