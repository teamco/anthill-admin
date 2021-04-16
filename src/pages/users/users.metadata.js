import React, { useState, useEffect } from 'react';
import { isAdmin } from '@/services/user.service';
import { NavLink } from 'umi';
import {
  ApiTwoTone,
  DeleteTwoTone,
  PlayCircleTwoTone,
  LockTwoTone,
  UnlockTwoTone,
  ProfileTwoTone,
  PauseCircleOutlined,
  SettingOutlined,
  DownOutlined,
  GlobalOutlined
} from '@ant-design/icons';

import {
  Popconfirm,
  Tooltip,
  Tag,
  Menu,
  Button,
  Dropdown
} from 'antd';

import classnames from 'classnames';
import styles from '@/pages/users/users.module.less';
import tableStyles from '@/components/Main/Table/table.module.less';
import { tsToLocaleDateTime } from '@/utils/timestamp';

const menu = (t, record, onDeleteUser, onSignOutUser, onUnlockUser, onLockUser, onHoldUser) => (
  <Menu>
    <Menu.Item key={'websites'}
               disabled={false}
               icon={<GlobalOutlined />}>
      <NavLink to={`/users/${record.id}/websites`}>
        {t('menu:userWebsites')}
      </NavLink>
    </Menu.Item>
    <Menu.Item key={'signOut'}>
      {record?.signedIn ? (
        <Popconfirm title={t('auth:signOutConfirm', { instance: record.email })}
                    placement={'topRight'}
                    onConfirm={() => onSignOutUser(record)}>
          <Tooltip title={t('auth:forceSignOut')}>
            <ApiTwoTone className={tableStyles.action} />
          </Tooltip>
        </Popconfirm>
      ) : (
        <Tooltip title={t('auth:forceSignOut')}>
          <ApiTwoTone twoToneColor={'#999999'}
                      className={tableStyles.action} />
        </Tooltip>
      )}
    </Menu.Item>
    <Menu.Item key={'lock'}>
      {record?.isLocked ? (
        <Popconfirm title={t('auth:unlockConfirm', { instance: record.email })}
                    placement={'topRight'}
                    onConfirm={() => onUnlockUser(record)}>
          <Tooltip title={t('auth:unlock')}>
            <LockTwoTone className={tableStyles.action} />
          </Tooltip>
        </Popconfirm>
      ) : (
        <Tooltip title={t('auth:lock')}>
          <UnlockTwoTone twoToneColor={'#eb2f96'}
                         className={tableStyles.action}
                         onClick={() => onLockUser(record)} />
        </Tooltip>
      )}
    </Menu.Item>
    <Menu.Item key={'hold'}
               disabled={false}
               icon={<PauseCircleOutlined />}
               onClick={() => onHoldUser()}>
      {t('actions:hold')}
    </Menu.Item>
  </Menu>
);

/**
 * @export
 * @param t
 * @param data
 * @param loading
 * @param list
 * @param currentUser
 * @param onDeleteUser
 * @param onSignOutUser
 * @param onUnlockUser
 * @param onLockUser
 * @param onHoldUser
 * @return {*}
 */
export const metadata = ({
  t,
  data,
  loading,
  list,
  currentUser = {},
  onDeleteUser,
  onSignOutUser,
  onHoldUser,
  onUnlockUser,
  onLockUser
}) => {
  useEffect(() => {
  }, []);

  return {
    width: '100%',
    size: 'middle',
    columns: [
      {
        title: t('table:name'),
        dataIndex: 'metadata',
        key: 'metadata',
        render(metadata, record) {
          const { gravatar_url, profile_image, name } = metadata?.profile;
          const color = '#52c41a';
          const signed = {
            title: t('auth:signedIn'),
            icon: <PlayCircleTwoTone twoToneColor={color} />
          };

          return (
            <div className={styles.nowrap}>
              <Tooltip title={signed.title}>
                <span className={classnames(styles.signed)}>{signed.icon}</span>
              </Tooltip>
              <img src={profile_image.url ? profile_image.url : gravatar_url}
                   className={styles.gridImg}
                   alt={name} />
              <span className={currentUser?.uid === data.uid ? styles.currentUser : null}>
                {name}
              </span>
            </div>
          );
        },
        filterable: list,
        sortable: list
      },
      {
        title: t('auth:provider'),
        dataIndex: 'provider',
        render: (provider) => (
          <Tag color={'cyan'}
               className={styles.provider}>
            {provider}
          </Tag>
        )
      },
      // {
      //   title: t('auth:lastSignInTime'),
      //   dataIndex: 'metadata',
      //   key: 'lastSignInTime',
      //   render: (metadata) => tsToLocaleDateTime(+new Date(metadata?.trackable?.last_sign_in_at))
      // },
      {
        title: t('table:action'),
        width: 100,
        render: (record) =>
          data.length ? (
            <div className={styles.nowrap}>
              {list && (
                <Tooltip title={t('menu:userProfile')}>
                  <NavLink to={`/users/${record.id}`}>
                    <ProfileTwoTone className={tableStyles.action}
                                    twoToneColor={'#52c41a'} />
                  </NavLink>
                </Tooltip>
              )}
              <Popconfirm title={t('msg:deleteConfirm', { instance: record.email })}
                          placement={'topRight'}
                          onConfirm={() => onDeleteUser(record)}>
                <Tooltip title={t('actions:delete')}>
                  <DeleteTwoTone className={tableStyles.action}
                                 twoToneColor='#eb2f96' />
                </Tooltip>
              </Popconfirm>
              <Dropdown overlay={menu(t, record, onDeleteUser, onSignOutUser, onUnlockUser, onLockUser, onHoldUser)}
                        disabled={false}
                        placement={'bottomRight'}
                        overlayClassName={styles.customActionMenu}
                        key={'custom'}>
                <Button size={'small'}
                        icon={<SettingOutlined />}
                        className={styles.customAction}>
                  {t('actions:manage', { type: '' })} <DownOutlined />
                </Button>
              </Dropdown>
            </div>
          ) : null
      }
    ],
    loading: loading.effects['userModel/query']
  };
};
