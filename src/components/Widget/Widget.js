import React, { createRef } from 'react';
import { Card } from 'antd';
import { connect } from 'dva';
import { withTranslation } from 'react-i18next';
import { SettingOutlined } from '@ant-design/icons';

import classnames from 'classnames';

import widgetsList from '@/components/Widget/widget.list';

import styles from '@/components/Widget/widget.module.less';

/**
 * @export
 * @param props
 * @return {JSX.Element|null|{isDragging: boolean}}
 * @constructor
 */
const Widget = props => {

  const {
    widgetProps,
    onInitFormDraft,
    onPropertiesModalVisibility,
    updateForm,
    contentModel
  } = props;

  const { content, offset, dimensions } = widgetProps;

  const {
    widgetStick
  } = widgetProps.entityForm || {};

  const position = {
    left: offset.x || 0,
    top: offset.y || 0
  };

  const { opacity, hideContent, targetModel, mode } = contentModel;

  const widget = widgetsList[content];
  const stickTo = widgetStick ?
    classnames(styles.stickTo, styles[widgetStick]) : '';

  const style = {
    ...position,
    ...dimensions,
    opacity
  };

  const card = (
    <div name={content}
         id={`widget-${widgetProps.contentKey}`}
         className={stickTo}
         style={style}>
      <Card hoverable
            bordered={false}
            className={styles.widgetCard}
            actions={[
              <SettingOutlined key={'setting'}
                               onClick={() => {
                                 onPropertiesModalVisibility(true, widgetProps, updateForm);
                                 onInitFormDraft(targetModel);
                               }} />
            ]}
            cover={(
              <div style={{ height: '100%' }}>
                <div className={styles.interactionHide} />
                <div style={hideContent ? { display: 'none' } : null}>
                  {React.cloneElement(widget, { opts: { content } })}
                </div>
              </div>
            )}>
      </Card>
    </div>
  );

  return widget ? card : null;
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
    onPropertiesModalVisibility(visible, widgetProps, updateForm) {
      dispatch({
        type: 'contentModel/propertiesModalVisibility',
        payload: {
          visible,
          updateForm,
          widgetProps
        }
      });
    }
  })
)(withTranslation()(Widget));
