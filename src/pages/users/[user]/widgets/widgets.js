import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { withTranslation } from 'react-i18next';
import { history, useParams } from 'umi';
import { Button, Card, Dropdown, Menu } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  AppstoreOutlined,
  SettingOutlined,
  StopOutlined
} from '@ant-design/icons';

import EmptyCard from '@/components/Card';
import cardStyles from '@/components/Card/card.module.less';

import { cachedUrl } from '@/utils/file';
import styles from '@/pages/users/[user]/websites/websites.module.less';
import Page from '@/components/Page';

const { Meta } = Card;

/**
 * @export
 * @constant
 * @param props
 * @return {JSX.Element}
 */
const widgets = (props) => {
  const {
    t,
    authModel,
    widgetModel,
    onEdit,
    onDelete,
    onNew,
    onQuery,
    onResetState,
    loading
  } = props;

  const { widgets } = widgetModel;

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
   * @param key
   * @param siteKey
   */
  const onMenuClick = ({ key, widgetKey }) => {
    if (key.key === 'delete') {
    }
  };

  /**
   * @constant
   * @param widgetKey
   * @return {JSX.Element}
   */
  const menu = (widgetKey) => {
    return (
      <Menu onClick={(key) => onMenuClick({ key, widgetKey })}>
        <Menu.Item key={'delete'}>
          <Button danger
                  size={'small'}
                  icon={<DeleteOutlined />}
                  type='text'>
            {t('actions:delete')}
          </Button>
        </Menu.Item>
      </Menu>
    );
  };

  const { ability } = authModel;
  const component = 'widgets';

  const pageProps = {
    ability,
    pageHeader: true,
    className: styles.websites,
    component,
    buttons: {
      newBtn: {
        onClick: () => onNew(user),
        loading: loading.effects['widgetModel/handleNew']
      }
    },
    metadata: {
      title: (
        <>
          <AppstoreOutlined style={{ marginRight: 10 }} />
          {t('menu:userWidgets')} ({widgets?.length || 0})
        </>
      )
    },
    spinEffects: [
      'authModel/defineAbilities',
      'widgetModel/handleDelete',
      'widgetModel/widgetQuery'
    ]
  };

  const [readWidgets, setReadWidgets] = useState(false);

  useEffect(() => {
    if (ability) {
      setReadWidgets(ability.can('read', 'widgets'));
    }
  }, [ability]);


  return (
    <Page {...pageProps}>
      <div className={styles.container}>
        {widgets?.length && readWidgets ? (
          widgets.map((widget, idx) => (
            <Card key={idx}
                  hoverable
                  className={cardStyles.card}
                  actions={[
                    <SettingOutlined key='setting' />,
                    <EditOutlined onClick={() => onEdit(user, widget.key)}
                                  key='edit' />,
                    <Dropdown overlay={menu(widget.key)}
                              placement={'topLeft'}
                              trigger={['click']}>
                      <EllipsisOutlined key='ellipsis' />
                    </Dropdown>
                  ]}
                  cover={
                    widget.picture?.url ?
                      (<img alt={widget.name}
                            src={cachedUrl(widget.picture.url)} />) :
                      (<StopOutlined />)
                  }>
              <Meta className={'site-card-title'}
                    title={widget.name}
                    description={widget.description || '...'} />
            </Card>
          ))
        ) : (
          <EmptyCard key={0}
                     instance={t('instance:widget')} />
        )}
      </div>
    </Page>
  );
};

export default connect(
  ({ authModel, widgetModel, loading }) => {
    return {
      authModel,
      widgetModel,
      loading
    };
  },
  (dispatch) => ({
    dispatch,
    onQuery(userKey) {
      dispatch({ type: 'widgetModel/widgetsQuery', payload: { userKey } });
    },
    onEdit(userKey, widgetKey) {
      history.push(`/accounts/${userKey}/widgets/${widgetKey}`);
    },
    onDelete(entityKey) {
      dispatch({
        type: 'widgetModel/handleDelete',
        payload: { entityKey }
      });
    },
    onNew() {
      history.push(`/pages/widgets/new`);
    }
  })
)(withTranslation()(widgets));
