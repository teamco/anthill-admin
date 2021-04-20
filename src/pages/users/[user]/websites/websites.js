import React, { useEffect } from 'react';
import { connect } from 'dva';
import { withTranslation } from 'react-i18next';
import { history, useParams } from 'umi';
import { Button, Card, Dropdown, Menu, PageHeader } from 'antd';
import {
  ApiOutlined,
  AppstoreAddOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  ProfileOutlined,
  SettingOutlined,
  StopOutlined,
  GlobalOutlined
} from '@ant-design/icons';

import i18n from '@/utils/i18n';
import Page from '@/components/Page';
import { showConfirm } from '@/utils/modals';
import { cachedUrl } from '@/utils/file';

import styles from '@/pages/users/[user]/websites/website.module.less';

const { Meta } = Card;
const { SubMenu } = Menu;

/**
 * @export
 * @constant
 * @param props
 * @return {JSX.Element}
 */
const websites = (props) => {
  const {
    t,
    authModel,
    websiteModel,
    onQuery,
    onEdit,
    onAssignWidgets,
    onDelete,
    onNew,
    onMode,
    loading
  } = props;

  const { websites } = websiteModel;

  /**
   * @type {{user}}
   */
  const { user } = useParams();

  useEffect(() => {
    onQuery(user);
  }, []);

  /**
   * @constant
   * @param key
   * @param siteKey
   */
  const onMenuClick = ({ key, siteKey }) => {
    if (key.key === 'delete') {
      showConfirm(() => onDelete(siteKey), i18n.t('actions:delete'));
    } else if (key.key === 'assignWidgets') {
      onAssignWidgets(siteKey);
    } else if (key.key === 'development') {
      onMode(siteKey, key.key);
    }
  };

  /**
   * @constant
   * @param siteKey
   * @return {JSX.Element}
   */
  const menu = (siteKey) => {
    return (
      <Menu className={styles.websiteMenu}
            onClick={(key) =>
              onMenuClick({
                key,
                siteKey
              })
            }>
        <SubMenu title={
          <Button icon={<ProfileOutlined />} type={'link'}>
            {t('website:mode')}
          </Button>}>
          <Menu.Item key={'development'}>
            <Button icon={<AppstoreAddOutlined />} type={'link'}>
              {t('mode:development')}
            </Button>
          </Menu.Item>
        </SubMenu>
        <Menu.Item key={'assignWidgets'}>
          <Button icon={<ApiOutlined />} type={'link'}>
            {t('website:assignWidgets')}
          </Button>
        </Menu.Item>
        <Menu.Item key={'delete'}>
          <Button danger icon={<DeleteOutlined />} type={'link'}>
            {t('actions:delete')}
          </Button>
        </Menu.Item>
      </Menu>
    );
  };

  const { ability } = authModel;
  const component = 'websites';

  const pageProps = {
    ability,
    pageHeader: true,
    className: styles.websites,
    component,
    buttons: {
      newBtn: {
        onClick: () => onNew(user),
        loading: loading.effects['websiteModel/handleNew']
      }
    },
    metadata: {
      title: (
        <>
          <GlobalOutlined style={{ marginRight: 10 }} />
          {t('menu:userWebsites')} ({websites?.length || 0})
        </>
      )
    },
    spinEffects: [
      'authModel/defineAbilities',
      'websiteModel/websitesQuery'
    ]
  };

  return (
    <Page {...pageProps}>
      <div className={styles.container}>
        {websites?.length ? (
          websites.map((site, idx) => (
            <Card key={idx}
                  hoverable
                  className={`site-card`}
                  actions={[
                    <SettingOutlined key={'setting'} />,
                    <EditOutlined onClick={() => onEdit(user, site.key)}
                                  key={'edit'} />,
                    <Dropdown overlay={menu(site.key)}
                              placement={'topLeft'}
                              trigger={['click']}>
                      <EllipsisOutlined key={'ellipsis'} />
                    </Dropdown>
                  ]}
                  cover={
                    site.picture.url ?
                      (<img alt={site.name} src={cachedUrl(site.picture.url)} />) :
                      (<StopOutlined />)
                  }>
              <Meta className={'site-card-title'}
                    title={site.name}
                    description={site.description || `...`} />
            </Card>
          ))
        ) : (
          <Card key={0}
                hoverable
                className={'site-card site-card-empty'}
                cover={<StopOutlined />}>
            <Meta className={'site-card-title'}
                  title={t('empty:title')}
                  description={t('empty:description', {
                    instance: '$t(instance:website)'
                  })} />
          </Card>
        )}
      </div>
    </Page>
  );
};

export default connect(
  ({ websiteModel, authModel, loading }) => {
    return {
      websiteModel,
      authModel,
      loading
    };
  },
  (dispatch) => ({
    dispatch,
    onEdit(userKey, websiteKey) {
      history.push(`/accounts/${userKey}/websites/${websiteKey}`);
    },
    onDelete(entityKey) {
      dispatch({
        type: 'websiteModel/handleDelete',
        payload: { entityKey }
      });
    },
    onQuery(userKey) {
      dispatch({ type: 'websiteModel/websitesQuery', payload: { userKey } });
    },
    onNew(userKey) {
      history.push(`/accounts/${userKey}/websites/new`);
    },
    onMode(entityKey, mode) {
      history.push(`/pages/websites/${entityKey}/${mode}`);
    },
    onAssignWidgets(entityKey) {
      history.push(`/pages/websites/${entityKey}/widgets`);
    }
  })
)(withTranslation()(websites));
