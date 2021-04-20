import React from 'react';
import { NavLink } from 'umi';
import {
  ApiTwoTone,
  DeleteTwoTone,
  PlayCircleTwoTone,
  ProfileTwoTone,
  PauseCircleTwoTone,
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
import { tsToLocaleDateTime } from '@/utils/timestamp';

import styles from '@/pages/users/users.module.less';
import tableStyles from '@/components/Main/Table/table.module.less';

/**
 * @constant
 * @param t
 * @param {{
 *  metadata:{auth:{signed_in}},
 *  profile:{email},
 *  key
 * }} record
 * @param currentUser
 * @param onDeleteUser
 * @param onSignOutUser
 * @return {JSX.Element}
 */
const menu = (t, record, onDeleteUser, onSignOutUser, currentUser) => {
  const { key, auth, profile } = record.metadata;

  return (
    <Menu>
      <Menu.Item key={'signOut'}
                 disabled={!auth?.signed_in || key === currentUser?.metadata?.key}>
        {auth?.signed_in && key !== currentUser?.metadata?.key ? (
          <Popconfirm title={t('auth:signOutConfirm', { instance: profile?.email })}
                      placement={'topRight'}
                      onConfirm={() => onSignOutUser(key)}>
            <Tooltip title={t('auth:forceSignOut')}>
              <ApiTwoTone className={tableStyles.action} />
              {t('auth:forceSignOut')}
            </Tooltip>
          </Popconfirm>
        ) : (
          <Tooltip title={t('auth:forceSignOut')}>
            <ApiTwoTone twoToneColor={'#999999'}
                        className={tableStyles.action} />
            {t('auth:forceSignOut')}
          </Tooltip>
        )}
      </Menu.Item>
      <Menu.Item key={'websites'}
                 disabled={false}
                 icon={<GlobalOutlined />}>
        <NavLink to={`/accounts/${key}/websites`}>
          {t('menu:userWebsites')}
        </NavLink>
      </Menu.Item>
    </Menu>
  );
};

/**
 * @export
 * @param t
 * @param data
 * @param loading
 * @param list
 * @param currentUser
 * @param onDeleteUser
 * @param onSignOutUser
 * @return {*}
 */
export const metadata = ({
  t,
  data,
  loading,
  list,
  currentUser = {},
  onDeleteUser,
  onSignOutUser
}) => {

  return {
    width: '100%',
    size: 'middle',
    columns: [
      {
        title: t('table:name'),
        dataIndex: 'metadata',
        key: 'metadata',
        width: 250,
        render(metadata) {
          const { gravatar_url, profile_image, name } = metadata?.profile;
          const { signed_in, force_sign_out } = metadata?.auth;
          const isCurrentUser = metadata?.key === currentUser.metadata?.key;
          let color = signed_in ? '#52c41a' : '#999999';
          color = force_sign_out ? '#DC143CFF' : color;
          const signed = {
            title: t(signed_in ? 'auth:signedIn' : 'auth:signedOut'),
            icon: signed_in ?
              (<PlayCircleTwoTone twoToneColor={color} />) :
              (<PauseCircleTwoTone twoToneColor={color} />)
          };

          return (
            <div className={styles.nowrap}>
              <Tooltip title={signed.title}>
                <span className={classnames(styles.signed)}>{signed.icon}</span>
              </Tooltip>
              <img src={profile_image.url ? profile_image.url : gravatar_url}
                   className={styles.gridImg}
                   alt={name} />
              <span className={isCurrentUser ? styles.currentUser : null}>
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
      {
        title: t('auth:lastSignInTime'),
        dataIndex: 'metadata',
        key: 'lastSignInTime',

        /**
         * @param {{trackable:{last_sign_in_at}}} metadata
         * @return {string}
         */
        render(metadata) {
          const { trackable } = metadata;
          return tsToLocaleDateTime(+new Date(trackable?.last_sign_in_at));
        }
      },
      {
        title: t('table:action'),
        fixed: 'right',
        width: 170,
        render(record) {
          const { key, profile } = record?.metadata;
          const cannotBeDeleted = key === currentUser.metadata.key;
          return data.length ? (
            <div className={classnames(styles.nowrap, styles.textEnd)}>
              {list && (
                <Tooltip title={t('menu:userProfile')}>
                  <NavLink to={`/accounts/${key}`}>
                    <ProfileTwoTone className={tableStyles.action}
                                    twoToneColor={'#52c41a'} />
                  </NavLink>
                </Tooltip>
              )}
              <Popconfirm title={t('msg:deleteConfirm', { instance: profile?.name || profile?.email })}
                          placement={'topRight'}
                          disabled={cannotBeDeleted}
                          onConfirm={() => onDeleteUser(record)}>
                <Tooltip title={t('actions:delete')}>
                  <DeleteTwoTone className={classnames(
                    tableStyles.action,
                    cannotBeDeleted ? tableStyles.disabled : ''
                  )}
                                 twoToneColor={cannotBeDeleted ? '#999999' : '#eb2f96'} />
                </Tooltip>
              </Popconfirm>
              <Dropdown overlay={menu(t, record, onDeleteUser, onSignOutUser, currentUser)}
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
          ) : null;
        }
      }
    ],
    loading: loading.effects['userModel/query']
  };
};
