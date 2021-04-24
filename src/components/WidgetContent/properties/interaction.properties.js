import React from 'react';
import {InputNumber, Radio, Switch, Tooltip} from 'antd';
import {
  BorderBottomOutlined,
  BorderInnerOutlined,
  BorderLeftOutlined,
  BorderRightOutlined,
  BorderTopOutlined,
  RadiusBottomleftOutlined,
  RadiusBottomrightOutlined,
  RadiusUpleftOutlined,
  RadiusUprightOutlined,
  RedoOutlined
} from '@ant-design/icons';

import i18n from '@/utils/i18n';

/**
 * @function
 * @param title
 * @param icon
 * @param value
 * @return {JSX.Element}
 * @private
 */
function _eventTooltip(title, icon, value) {
  return (
      <Radio.Button value={value}
                    name={value}>
        <Tooltip title={i18n.t(title)}>
          {icon}
        </Tooltip>
      </Radio.Button>
  );
}

/**
 * @export
 * @param onChange
 * @return {*}
 */
export const interactionProperties = ({onChange}) => {
  const interactions = [
    [
      (
          <Switch name={'widgetOverlapping'}
                  config={{valuePropName: 'checked'}}
                  label={i18n.t('widget:overlapping')}
                  key={'widgetOverlapping'}
                  onChange={() => onChange('widgetOverlapping')}/>
      ),
      (
          <Switch name={'widgetAlwaysOnTop'}
                  config={{valuePropName: 'checked'}}
                  label={i18n.t('widget:alwaysOnTop')}
                  key={'widgetAlwaysOnTop'}
                  onChange={() => onChange('widgetAlwaysOnTop')}/>
      ),
      (
          <Switch name={'widgetFreeze'}
                  config={{valuePropName: 'checked'}}
                  label={i18n.t('widget:freeze')}
                  key={'widgetFreeze'}
                  onChange={() => onChange('widgetFreeze')}/>
      )
    ],
    [
      (
          <Switch name={'widgetDraggable'}
                  config={{valuePropName: 'checked'}}
                  label={i18n.t('widget:draggable')}
                  key={'widgetDraggable'}
                  onChange={() => onChange('widgetDraggable')}/>
      ),
      (
          <Switch name={'widgetResizable'}
                  config={{valuePropName: 'checked'}}
                  label={i18n.t('widget:resizable')}
                  key={'widgetResizable'}
                  onChange={() => onChange('resizable')}/>
      ),
      (
          <Switch name={'widgetScrollable'}
                  config={{valuePropName: 'checked'}}
                  label={i18n.t('widget:scrollable')}
                  key={'widgetScrollable'}
                  onChange={() => onChange('widgetScrollable')}/>
      )
    ],
    [
      (
          <Switch name={'widgetMaximizable'}
                  config={{valuePropName: 'checked'}}
                  label={i18n.t('widget:maximizable')}
                  key={'widgetMaximizable'}
                  onChange={() => onChange('widgetMaximizable')}/>
      ),
      (
          <Switch name={'widgetZoomable'}
                  config={{valuePropName: 'checked'}}
                  label={i18n.t('widget:zoomable')}
                  key={'widgetZoomable'}
                  onChange={() => onChange('widgetZoomable')}/>
      ),
      (
          <InputNumber min={0}
                       max={10000}
                       label={i18n.t('widget:setLayer')}
                       key={'widgetSetLayerUp'}
                       name={'widgetSetLayerUp'}
                       onChange={() => onChange('widgetSetLayerUp')}/>
      )
    ]
  ];

  const dimensions = [
    [
      (
          <InputNumber min={0}
                       max={10000}
                       label={i18n.t('widget:cellWidth')}
                       key={'widgetCellWidth'}
                       name={'widgetCellWidth'}
                       onChange={() => onChange('widgetCellWidth')}/>
      ),
      (
          <InputNumber min={0}
                       max={10000}
                       label={i18n.t('widget:rowHeight')}
                       key={'widgetRowHeight'}
                       name={'widgetRowHeight'}
                       onChange={() => onChange('widgetRowHeight')}/>
      )
    ],
    [
      (
          <Switch name={'widgetStretchWidth'}
                  label={i18n.t('widget:stretchWidth')}
                  key={'widgetStretchWidth'}
                  config={{valuePropName: 'checked'}}
                  onChange={() => onChange('widgetStretchWidth')}/>
      ),
      (
          <Switch name={'widgetStretchHeight'}
                  config={{valuePropName: 'checked'}}
                  label={i18n.t('widget:stretchHeight')}
                  key={'widgetStretchHeight'}
                  onChange={() => onChange('widgetStretchHeight')}/>
      )
    ],
    [
      (
          <Radio.Group buttonStyle={'solid'}
                       name={'widgetUnstick'}
                       label={i18n.t('widget:unStickLabel')}
                       key={'widgetUnstick'}
                       onChange={() => onChange('widgetUnstick')}>
            <Radio.Button value={'widgetUnstick'}>
              <RedoOutlined/>
              {i18n.t('widget:unStick')}
            </Radio.Button>
          </Radio.Group>
      ),
      (
          <Radio.Group buttonStyle={'solid'}
                       name={'widgetStick'}
                       label={i18n.t('widget:stick')}
                       key={'widgetStick'}
                       onChange={e => onChange(e.target.value)}>
            <div style={{marginBottom: 2}}>
              {_eventTooltip('widget:stickToTopLeft', <RadiusUpleftOutlined/>, 'widgetStickToTopLeft')}
              {_eventTooltip('widget:stickToCenterTop', <BorderTopOutlined/>, 'widgetStickToCenterTop')}
              {_eventTooltip('widget:stickToTopRight', <RadiusUprightOutlined/>, 'widgetStickToTopRight')}
            </div>
            <div style={{marginBottom: 2}}>
              {_eventTooltip('widget:stickToCenterLeft', <BorderLeftOutlined/>, 'widgetStickToCenterLeft')}
              {_eventTooltip('widget:stickToCenter', <BorderInnerOutlined/>, 'widgetStickToCenter')}
              {_eventTooltip('widget:stickToCenterRight', <BorderRightOutlined/>, 'widgetStickToCenterRight')}
            </div>
            <div style={{marginBottom: 2}}>
              {_eventTooltip('widget:stickToBottomLeft', <RadiusBottomleftOutlined/>, 'widgetStickToBottomLeft')}
              {_eventTooltip('widget:stickToCenterBottom', <BorderBottomOutlined/>, 'widgetStickToCenterBottom')}
              {_eventTooltip('widget:stickToBottomRight', <RadiusBottomrightOutlined/>, 'widgetStickToBottomRight')}
            </div>
          </Radio.Group>
      )
    ]
  ];

  return {
    dimensions,
    interactions
  };
};
