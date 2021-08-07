import React, { useEffect, useState } from 'react';
import { history, useParams } from 'umi';
import { connect } from 'dva';
import { withTranslation } from 'react-i18next';
import classnames from 'classnames';
import { Card, Checkbox, Form, Tooltip } from 'antd';
import { EditOutlined, StopOutlined } from '@ant-design/icons';

import FormComponents from '@/components/Form';

import styles from '@/pages/users/[user]/websites/websites.module.less';

const { GenericPanel } = FormComponents;

const websiteWidgets = props => {

  const [formRef] = Form.useForm();

  const {
    t,
    loading,
    onSave,
    onClose,
    onAssignWidgets,
    onWebsiteWidgets,
    onWidgetEdit,
    onAssignWidget,
    authModel,
    websiteModel
  } = props;

  const [disabled, setDisabled] = useState(true);

  /**
   * @type {{user, website}}
   */
  const { user, website } = useParams();
  const { ability } = authModel;
  const component = 'websiteWidgets';

  useEffect(() => {
    if (ability) {
      setDisabled(ability.cannot('update', component));
      onWebsiteWidgets(user, website);
    }
  }, [ability]);

  useEffect(() => {

  }, []);

  const {
    widgets,
    assignedWidgets,
    timestamp = {}
  } = websiteModel;

  /**
   * @constant
   */
  const onFinish = () => {
    onSave();
  };

  /**
   * @constant
   * @param widget
   * @return {JSX.Element}
   * @private
   */
  const _tooltip = widget => (
    <Tooltip title={(
      <div>
        <div>{widget.name}</div>
        <div>{widget.description}</div>
      </div>
    )}>
      <img alt={widget.name}
           src={widget.picture.url} />
    </Tooltip>
  );

  /**
   * @constant
   * @type {JSX.Element}
   * @private
   */
  const _noData = (
    <Card key={0}
          hoverable
          className={classnames(styles.websiteWidgetCard, styles.websiteWidgetCardEmpty)}
          cover={(
            <Tooltip title={t('empty:title')}>
              <StopOutlined />
            </Tooltip>
          )}>
    </Card>
  );

  /**
   * @constant
   * @param key
   * @return {boolean}
   * @private
   */
  const _isAssigned = key => {
    return !!assignedWidgets.find(widget => widget.key === key);
  };

  return (
    <Form layout={'vertical'}
          form={formRef}
          onFinish={onFinish}>
      <GenericPanel header={t('website:assignedWidgets')}
                    inRow={false}
                    name={'assignedWidgets'}
                    defaultActiveKey={['assignedWidgets']}>
        <div>
          {assignedWidgets.length ?
            assignedWidgets.map((widget, idx) => (
                <Card key={idx}
                      hoverable
                      className={styles.websiteWidgetCard}
                      actions={[
                        <EditOutlined onClick={() => onWidgetEdit(widget.key)}
                                      key='edit' />
                      ]}
                      cover={_tooltip(widget)}>
                </Card>
              )
            ) : _noData
          }
        </div>
      </GenericPanel>
      <GenericPanel header={t('menu:widgets')}
                    inRow={false}
                    name={'widgets'}
                    defaultActiveKey={['widgets']}>
        <div>
          {widgets.length ?
            widgets.map((widget, idx) => (
                <Card key={idx}
                      hoverable
                      className={styles.websiteWidgetCard}
                      actions={[
                        <EditOutlined onClick={() => onWidgetEdit(widget.key)}
                                      key={'edit'} />,
                        <Checkbox name={'assign-widget'}
                                  checked={_isAssigned(widget.key)}
                                  onChange={e => onAssignWidget(e.target.checked, widget)} />
                      ]}
                      cover={_tooltip(widget)}>
                </Card>
              )
            ) : _noData
          }
        </div>
      </GenericPanel>
    </Form>
  );
};

export default connect(({
    authModel,
    websiteModel,
    loading
  }) => {
    return {
      authModel,
      websiteModel,
      loading
    };
  },
  dispatch => ({
    dispatch,
    onWebsiteWidgets(userKey, websiteKey) {
      dispatch({
        type: 'websiteModel/websiteWidgetsQuery',
        payload: { userKey, websiteKey }
      });
    },
    onSave(payload) {
      dispatch({
        type: 'websiteModel/saveAssignedWidgets',
        payload
      });
    },
    onClose() {
      dispatch(history.push(`/pages/websites`));
    },
    onAssignWidgets(payload) {
      dispatch({
        type: 'websiteModel/assignWidgets',
        payload
      });
    },
    onWidgetEdit(key) {
      dispatch({
        type: 'widgetModel/prepareToEdit',
        payload: { key }
      });
    },
    onAssignWidget(checked, widget) {
      dispatch({
        type: `websiteModel/${checked ? 'assignWidget' : 'unassignWidget'}`,
        payload: { widget }
      });
    }
  })
)(withTranslation()(websiteWidgets));
