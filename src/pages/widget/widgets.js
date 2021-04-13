import React, { useEffect } from 'react';
import { connect } from 'dva';
import { withTranslation } from 'react-i18next';
import { history } from 'umi';
import { Button, Card, Dropdown, Menu } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
  StopOutlined,
} from '@ant-design/icons';

import classnames from 'classnames';

import { showConfirm } from '@/utils/modals';
import i18n from '@/utils/i18n';

import styles from '@/pages/widget/widget.module.less';

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
    widgetModel,
    onEdit,
    onDelete,
    onButtonsMetadata,
    onNew,
    loading,
  } = props;

  useEffect(() => {
    onButtonsMetadata({
      newBtn: {
        onClick: onNew,
        loading: loading.effects['widgetModel/handleNew'],
      },
    });
  }, [widgetModel]);

  /**
   * @constant
   * @param key
   * @param siteKey
   */
  const onMenuClick = ({ key, widgetKey }) => {
    if (key.key === 'delete') {
      showConfirm(() => onDelete(widgetKey), i18n.t('actions:delete'));
    }
  };

  /**
   * @constant
   * @param widgetKey
   * @return {JSX.Element}
   */
  const menu = (widgetKey) => {
    return (
      <Menu
        onClick={(key) =>
          onMenuClick({
            key,
            widgetKey,
          })
        }
      >
        <Menu.Item key={'delete'}>
          <Button danger icon={<DeleteOutlined />} type="text">
            {t('actions:delete')}
          </Button>
        </Menu.Item>
      </Menu>
    );
  };

  return (
    <div>
      {widgetModel.widgets.length ? (
        widgetModel.widgets.map((widget, idx) => (
          <Card
            key={idx}
            hoverable
            className={styles.widgetCard}
            actions={[
              <SettingOutlined key="setting" />,
              <EditOutlined onClick={() => onEdit(widget.key)} key="edit" />,
              <Dropdown
                overlay={menu(widget.key)}
                placement={'topLeft'}
                trigger={['click']}
              >
                <EllipsisOutlined key="ellipsis" />
              </Dropdown>,
            ]}
            cover={<img alt={widget.name} src={widget.picture.url} />}
          >
            <Meta
              className={'site-card-title'}
              title={widget.name}
              description={widget.description || '...'}
            />
          </Card>
        ))
      ) : (
        <Card
          key={0}
          hoverable
          className={classnames(styles.widgetCard, styles.widgetCardEmpty)}
          cover={<StopOutlined />}
        >
          <Meta
            className={'site-card-title'}
            title={t('empty:title')}
            description={t('empty:description', {
              instance: '$t(instance:widget)',
            })}
          />
        </Card>
      )}
    </div>
  );
};

export default connect(
  ({ widgetModel, loading }) => {
    return {
      widgetModel,
      loading,
    };
  },
  (dispatch) => ({
    dispatch,
    onButtonsMetadata(payload) {
      dispatch({
        type: 'appModel/activeButtons',
        payload,
      });
    },
    onEdit(key) {
      dispatch({
        type: 'widgetModel/prepareToEdit',
        payload: { key },
      });
    },
    onDelete(entityKey) {
      dispatch({
        type: 'widgetModel/handleDelete',
        payload: { entityKey },
      });
    },
    onNew() {
      history.push(`/pages/widgets/new`);
    },
  }),
)(withTranslation()(widgets));
