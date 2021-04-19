import React from 'react';
import { Button, Dropdown, Layout, Menu } from 'antd';

import { DownOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { withTranslation } from 'react-i18next';

import styles from '@/components/Main/Header/mainHeader.module.less';
import { connect } from 'dva';

const { Header } = Layout;

const mainHeader = props => {

  const { t, authModel, loading, onSignOut } = props;
  const { currentUser } = authModel;

  const menu = (
    <Menu>
      <Menu.Item key={'logout'}
                 disabled={false}
                 onClick={onSignOut}
                 icon={<LogoutOutlined />}>
        {t('auth:signOut')}
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className={styles.header}>
      <div className={styles.actions}>
        {currentUser && (
          <Dropdown overlay={menu}
                    disabled={false}
                    placement={'bottomRight'}
                    overlayClassName={styles.customActionMenu}
                    key={'custom'}>
            <Button size={'small'}
                    type={'text'}
                    icon={<UserOutlined />}
                    className={styles.customAction}>
              {currentUser?.metadata?.profile?.name} <DownOutlined />
            </Button>
          </Dropdown>
        )}
      </div>
    </Header>
  );
};

export default connect(
  ({ authModel, loading }) => {
    return { authModel, loading };
  },
  (dispatch) => ({
    dispatch,
    onSignOut() {
      dispatch({ type: 'authModel/signOut' });
    }
  })
)(withTranslation()(mainHeader));
