import React, { useEffect, useState } from 'react';
import { Card, message } from 'antd';
import { connect } from 'dva';
import { withTranslation } from 'react-i18next';
import { SettingOutlined } from '@ant-design/icons';

import { raiseConditionMsg } from '@/utils/message';
import widgetsList from '@/components/WidgetContent/widgets.list';
import EmptyCard from '@/components/Card';

import styles from '@/components/WidgetContent/widgetContent.module.less';
import { generateKey } from '@/services/common.service';

/**
 * @export
 * @param props
 * @return {JSX.Element|null|{isDragging: boolean}}
 * @constructor
 */
const WidgetContent = props => {

  const {
    t,
    widgetProps,
    onResetState,
    onInitFormDraft,
    onSetting,
    updateForm,
    widgetContentModel,
    contentKey
  } = props;

  const { content, dimensions } = widgetProps;

  const position = { left: 0, top: 0 };

  const {
    opacity,
    hideContent,
    entityForm
  } = widgetContentModel;

  const style = {
    ...position,
    ...dimensions,
    opacity
  };

  const [widget, setWidget] = useState(null);
  const [interactionCss, setInteractionCss] = useState(styles.interactionHide);

  useEffect(() => {
    if (content) {
      const widgetContent = widgetsList[content];

      if (widgetContent) {
        setWidget(widgetContent);
      } else {
        message.warning(raiseConditionMsg(`${t('instance:widget')}: ${content}`)).then();
      }
    }
  }, [content]);

  useEffect(() => {
    // onEditWebsite(user, website);
    return onResetState;
  }, []);

  /**
   * @constant
   * @param e
   */
  const handleSetting = e => {
    e.preventDefault();
    onSetting(true, widgetProps, updateForm, contentKey);
    // onInitFormDraft(targetModel);
  };

  /**
   * @constant
   * @param e
   * @param handle
   */
  const handleInteractions = (e, handle) => {
    e.preventDefault();
    setInteractionCss(handle ? '' : styles.interactionHide);
  };

  /**
   * To prevent IDE identifying issues after change state.
   * @constant
   * @type {DetailedReactHTMLElement<HTMLAttributes<HTMLElement>, HTMLElement>}
   */
  const cloningWidget = widget;

  return (
    <div name={content}
         id={`widget-${widgetProps.contentKey}`}
         className={styles.widget}
         onDoubleClick={e => handleInteractions(e, true)}
         onMouseLeave={e => handleInteractions(e, false)}
         style={style}>
      {cloningWidget ? (
        <Card hoverable
              bordered={false}
              className={styles.widgetCard}
              actions={[
                <SettingOutlined key={'setting'}
                                 onClick={handleSetting} />
              ]}
              cover={(
                <div style={{ height: '100%' }}>
                  <div className={interactionCss} />
                  <div style={hideContent ? { display: 'none' } : null}>
                    {React.cloneElement(cloningWidget, {
                      opts: { content, contentKey }
                    })}
                  </div>
                </div>
              )}>
        </Card>
      ) : (
        <EmptyCard className={styles.widgetCard}
                   bordered={false} />
      )}
    </div>
  );
};

export default connect(({
    widgetContentModel,
    loading
  }) => {
    return {
      widgetContentModel,
      loading
    };
  },
  dispatch => ({
    dispatch,
    onResetState() {
      dispatch({ type: 'widgetContentModel/resetState' });
    },
    onSetting(visible, widgetProps, updateForm, contentKey) {
      dispatch({
        type: 'widgetContentModel/handleSettingModal',
        payload: { visible, widgetProps, updateForm, contentKey }
      });
    }
  })
)(withTranslation()(WidgetContent));
