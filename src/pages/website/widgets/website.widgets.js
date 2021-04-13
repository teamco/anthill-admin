import React, {useEffect} from 'react';
import {history} from 'umi';
import {connect} from 'dva';
import {withTranslation} from 'react-i18next';
import classnames from 'classnames';
import {Card, Checkbox, Form, Tooltip} from 'antd';
import {EditOutlined, StopOutlined} from '@ant-design/icons';

import {fillFormEffect} from '@/utils/state';
import FormComponents from '@/components/Form';

import styles from '../website.module.less';

const {GenericPanel} = FormComponents;

const websiteWidgets = props => {

  const formRef = React.createRef();

  const {
    t,
    loading,
    onStoreForm,
    onSave,
    onClose,
    onAssignWidgets,
    onButtonsMetadata,
    onWidgetEdit,
    onAssignWidget,
    websiteModel
  } = props;

  useEffect(() => {
    onButtonsMetadata({
      saveBtn: {
        onClick: onAssignWidgets,
        loading: loading.effects[`websiteModel/saveAssignedWidgets`]
      },
      closeBtn: {
        onClick: onClose,
        loading: false
      }
    });

    onStoreForm(formRef);

    fillFormEffect(websiteModel, formRef.current);

  }, [websiteModel]);

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
             src={widget.picture.url}/>
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
                  <StopOutlined/>
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
            ref={formRef}
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
                                              key="edit"/>
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
                                              key={'edit'}/>,
                                <Checkbox name={'assign-widget'}
                                          checked={_isAssigned(widget.key)}
                                          onChange={e => onAssignWidget(e.target.checked, widget)}/>
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
      websiteModel,
      loading
    }) => {
      return {
        websiteModel,
        loading
      };
    },
    dispatch => ({
      dispatch,
      onStoreForm(form) {
        dispatch({
          type: 'appModel/storeForm',
          payload: {
            form: {...form},
            model: 'websiteModel'
          }
        });
      },
      onSave(payload) {
        dispatch({
          type: 'websiteModel/saveAssignedWidgets',
          payload
        });
      },
      onButtonsMetadata(payload) {
        dispatch({
          type: 'appModel/activeButtons',
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
          payload: {key}
        });
      },
      onAssignWidget(checked, widget) {
        dispatch({
          type: `websiteModel/${checked ? 'assignWidget' : 'unassignWidget'}`,
          payload: {widget}
        });
      }
    })
)(withTranslation()(websiteWidgets));
