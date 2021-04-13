import React, {createRef} from 'react';
import {Card} from 'antd';
import {connect} from 'dva';
import {withTranslation} from 'react-i18next';
import {ResizableBox} from 'react-resizable';
import {SettingOutlined} from '@ant-design/icons';

import {useDrag} from 'react-dnd';
import classnames from 'classnames';

import {itemTypes} from '@/pages/website/mode/development/itemTypes';
import widgets from '@/components/Widget/widget.list';
import styles from '@/components/Widget/widget.module.less';
import '@/components/Widget/resizable.less';

const MIN_OPACITY = 0.2;
const MAX_OPACITY = 1;

/**
 * @export
 * @param props
 * @return {JSX.Element|null|{isDragging: boolean}}
 * @constructor
 */
const Widget = props => {
  let [{isDragging}, drag] = [{isDragging: false}, createRef()];

  const {
    widgetProps,
    onInitFormDraft,
    onPropertiesModalVisibility,
    onSetActiveWidget,
    onResizeStop,
    onResize,
    onSetOpacity,
    onHideContent,
    updateForm,
    contentModel
  } = props;

  const content = widgetProps.name,
      offset = widgetProps.offset || {},
      dimensions = widgetProps.dimensions;

  const {
    widgetHideContentOnInteraction,
    widgetDraggable,
    widgetResizable,
    widgetStick
  } = widgetProps.entityForm || {};

  const draggable = updateForm ? widgetDraggable : false;
  const resizable = updateForm ? widgetResizable : false;

  const position = {
    left: offset.x || 0,
    top: offset.y || 0
  };

  const {opacity, hideContent, targetModel, mode} = contentModel;

  const _onStart = () => {
    onSetActiveWidget(widgetProps);
    widgetHideContentOnInteraction ?
        onHideContent(true) :
        onSetOpacity(MIN_OPACITY);
  };

  const _onStop = () => {
    onSetActiveWidget(undefined);
    widgetHideContentOnInteraction ?
        onHideContent(false) :
        onSetOpacity(MAX_OPACITY);
  };

  if (draggable) {
    [{isDragging}, drag] = useDrag({
      item: {
        name: content,
        type: itemTypes.WIDGET
      },
      begin(monitor) {
        _onStart();
      },
      end(item, monitor) {
        const dropResult = monitor.getDropResult();
        if (item && dropResult) {
          _onStop();
        }
      },
      collect(monitor) {
        return {
          isDragging: monitor.isDragging()
        };
      }
    });
  }

  const widget = widgets[content];
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
           ref={drag}
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
                                 }}/>
              ]}
              cover={(
                  <div style={{height: '100%'}}>
                    <div className={styles.interactionHide}/>
                    <div style={hideContent ? {display: 'none'} : null}>
                      {React.cloneElement(widget, {
                        opts: {content}
                      })}
                    </div>
                  </div>
              )}>
        </Card>
      </div>
  );

  return widget ? resizable ? (
      <ResizableBox className={classnames(styles.widget, styles[mode])}
                    style={{...position}}
                    onResize={(e, data) => {
                      _onStart();
                      onResize(data, widgetProps);
                    }}
                    onResizeStop={(e, data) => {
                      _onStop();
                      onResizeStop(data, widgetProps);
                    }}
                    width={dimensions.width}
                    height={dimensions.height}
                    resizeHandles={['se']}>
        {card}
      </ResizableBox>
  ) : card : null;
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
      },
      onInitFormDraft(model) {
        dispatch({
          type: `contentModel/initFormDraft`,
          payload: {model}
        });
      },
      onSetOpacity(opacity) {
        dispatch({
          type: 'contentModel/setOpacity',
          payload: {opacity}
        });
      },
      onHideContent(hide) {
        dispatch({
          type: 'contentModel/hideContent',
          payload: {hide}
        });
      },
      onSetActiveWidget(widget) {
        dispatch({
          type: 'pageModel/setActiveWidget',
          payload: {widget}
        });
      }
    })
)(withTranslation()(Widget));
