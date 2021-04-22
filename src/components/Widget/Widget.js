import React, { createRef, useEffect, useState } from 'react';
import { Card, message } from 'antd';
import { connect } from 'dva';
import { withTranslation } from 'react-i18next';
import { SettingOutlined } from '@ant-design/icons';

import { raiseConditionMsg } from '@/utils/message';
import widgetsList from '@/components/Widget/widget.list';
import EmptyCard from '@/components/Card';

import styles from '@/components/Widget/widget.module.less';

/**
 * @export
 * @param props
 * @return {JSX.Element|null|{isDragging: boolean}}
 * @constructor
 */
const Widget = props => {

  const {
    t,
    widgetProps,
    onResetState,
    onInitFormDraft,
    onSetting,
    updateForm,
    contentModel
  } = props;

  const { content, offset, dimensions } = widgetProps;

  const {
    widgetStick
  } = widgetProps.entityForm || {};

  const position = { left: 0, top: 0 };

  const { opacity, hideContent, targetModel, mode } = contentModel;

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

  const handleSetting = e => {
    e.preventDefault();

    onSetting(true, widgetProps, updateForm);
    // onInitFormDraft(targetModel);
  };

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
                    {React.cloneElement(cloningWidget, { opts: { content } })}
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
    contentModel,
    loading
  }) => {
    return {
      contentModel,
      loading
    };
  },
  dispatch => ({
    dispatch,
    onResetState() {
      dispatch({ type: 'contentModel/resetState' });
    },
    onSetting(visible, widgetProps, updateForm) {
      dispatch({
        type: 'contentModel/handleSettingModal',
        payload: {
          visible,
          updateForm,
          widgetProps
        }
      });
    }
  })
)(withTranslation()(Widget));
