import React, { useEffect, useState } from 'react';
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
    websiteModel,
    widgetModel,
    loading,
    onGetUser,
    onWebsitesQuery,
    onWidgetsQuery,
    onShowWidgets,
    onShowWebsites
  } = props;

  const { websites } = websiteModel;
  const { widgets } = widgetModel;
  const { ability } = authModel;

  const { user } = useParams();

  const component = 'profile';

  useEffect(() => {
    onGetUser(user);
    onWebsitesQuery(user);
    onWidgetsQuery(user);
  }, []);

  const [readWebsites, setReadWebsites] = useState(false);
  const [readWidgets, setReadWidgets] = useState(false);

  useEffect(() => {
    if (ability) {
      setReadWebsites(ability.can('read', 'websites'));
      setReadWidgets(ability.can('read', 'widgets'));
    }
  }, [ability]);

  return (
    <Page className={userStyles.users}
          component={component}
          spinEffects={[
            'authModel/defineAbilities',
            'userModel/getUser',
            'websiteModel/websitesQuery',
            'widgetModel/widgetsQuery'
          ]}>
      <Users profiled={true} />
      <div className={styles.userCardWrapper}>
        <AntHillRow>
          {readWebsites && (
            <Card className={classnames(styles.userCard, styles.websites)}
                  hoverable
                  onClick={() => onShowWebsites(user)}>
              <Statistic title={websites?.length || '0'}
                         value={t('menu:websites')}
                         prefix={<GlobalOutlined />} />
            </Card>
          )}
          {readWidgets && (
            <Card className={classnames(styles.userCard, styles.widgets)}
                  hoverable
                  onClick={() => onShowWidgets(user)}>
              <Statistic title={widgets?.length || '0'}
                         value={t('menu:widgets')}
                         prefix={<AppstoreOutlined />} />
            </Card>
          )}
        </AntHillRow>
      </div>
    </Page>
  );
};

export default connect(
  ({
    authModel,
    websiteModel,
    widgetModel,
    loading
  }) => {
    return {
      authModel,
      websiteModel,
      widgetModel,
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
    },
    onWidgetsQuery(userKey) {
      dispatch({ type: 'widgetModel/widgetsQuery', payload: { userKey } });
    },
    onShowWidgets(userKey) {
      history.push(`/accounts/${userKey}/widgets`);
    }
  })
)(withTranslation()(profile));
