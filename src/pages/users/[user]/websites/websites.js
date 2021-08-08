import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { withTranslation } from 'react-i18next';
import { history, useParams } from 'umi';
import { Button, Card, Dropdown, Menu } from 'antd';
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

import request from '@/utils/request';
import Page from '@/components/Page';
import EmptyCard from '@/components/Card';

import { showConfirm } from '@/utils/modals';
import { cachedUrl } from '@/utils/file';

import styles from '@/pages/users/[user]/websites/websites.module.less';
import pageStyles from '@/components/Page/page.module.less';
import cardStyles from '@/components/Card/card.module.less';

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
    onResetState,
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
    return onResetState;
  }, []);

  /**
   * @constant
   * @param menu
   * @param {{key, name}} site
   */
  const onMenuClick = ({ menu, site }) => {
    if (menu.key === 'delete') {
      showConfirm({
        className: pageStyles.deleteConfirm,
        onOk: () => onDelete(site.key),
        okText: t('actions:delete'),
        okType: 'danger',
        instance: t('instance:website'),
        name: site.name
      });
    } else if (menu.key === 'assignWidgets') {
      onAssignWidgets(site.key);
    } else if (menu.key === 'development') {
      onMode(site.key, menu.key);
    }
  };

  /**
   * @constant
   * @param {{key, name}} site
   * @return {JSX.Element}
   */
  const menu = (site) => {
    return (
      <Menu className={styles.websiteMenu}
            onClick={(menu) => onMenuClick({ menu, site })}>
        <SubMenu key={'mode'}
                 title={(
                   <Button icon={<ProfileOutlined />}
                           size={'small'}
                           type={'link'}>
                     {t('website:mode')}
                   </Button>
                 )}>
          <Menu.Item key={'development'}>
            <Button icon={<AppstoreAddOutlined />}
                    size={'small'}
                    type={'link'}>
              {t('mode:development')}
            </Button>
          </Menu.Item>
        </SubMenu>
        <Menu.Item key={'assignWidgets'}>
          <Button icon={<ApiOutlined />}
                  size={'small'}
                  type={'link'}>
            {t('website:assignWidgets')}
          </Button>
        </Menu.Item>
        <Menu.Item key={'delete'}>
          <Button danger
                  size={'small'}
                  icon={<DeleteOutlined />}
                  type={'link'}>
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
        loading: loading.effects['websiteModel/websitesHandleNew']
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
      'websiteModel/websitesHandleDelete',
      'websiteModel/websitesQuery'
    ]
  };

  const [readWebsites, setReadWebsites] = useState(false);
  const [readWidgets, setReadWidgets] = useState(false);

  useEffect(() => {
    if (ability) {
      setReadWebsites(ability.can('read', 'websites'));
      setReadWidgets(ability.can('read', 'widgets'));
    }
  }, [ability]);

  return (
    <Page {...pageProps}>
      <div className={styles.container}>
        {websites?.length && readWebsites ? (
          websites.map((site, idx) => (
            <Card key={idx}
                  className={cardStyles.card}
                  hoverable
                  actions={[
                    <SettingOutlined key={'setting'} />,
                    <EditOutlined onClick={() => onEdit(user, site.key)}
                                  key={'edit'} />,
                    <Dropdown overlay={menu(site)}
                              placement={'topRight'}
                              trigger={['click']}>
                      <EllipsisOutlined key={'ellipsis'} />
                    </Dropdown>
                  ]}
                  cover={
                    site.picture?.url ?
                      (<img alt={site.name}
                            src={cachedUrl(site.picture.url)} />) :
                      (<StopOutlined />)
                  }>
              <Meta className={cardStyles.title}
                    title={site.name}
                    description={site.description || `...`} />
            </Card>
          ))
        ) : (
          <EmptyCard key={0}
                     instance={t('instance:website')} />
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
    onDelete(websiteKey) {
      dispatch({ type: 'websiteModel/handleDelete', payload: { websiteKey } });
    },
    onResetState() {
      dispatch({ type: 'websiteModel/resetState' });
    },
    onQuery(userKey) {
      dispatch({ type: 'websiteModel/websitesQuery', payload: { userKey } });
    },
    onNew(userKey) {
      history.push(`/accounts/${userKey}/websites/new`);
    },
    onMode(entityKey, mode) {
      const { UI_URL, UI_PORT } = request.apiConfig;
      window.open(`${UI_URL}:${UI_PORT}/websites/${entityKey}/${mode}`, '_blank').focus();
    },
    onAssignWidgets(userKey, websiteKey) {
      history.push(`/accounts/${userKey}/websites/${websiteKey}/widgets`);
    }
  })
)(withTranslation()(websites));
