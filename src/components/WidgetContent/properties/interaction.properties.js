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
          <Switch name={['setting', 'widget', 'overlapping']}
                  config={{valuePropName: 'checked'}}
                  label={i18n.t('widget:overlapping')}
                  key={'widget.overlapping'}
                  onChange={() => onChange('widgetOverlapping')}/>
      ),
      (
          <Switch name={['setting', 'widget', 'alwaysOnTop']}
                  config={{valuePropName: 'checked'}}
                  label={i18n.t('widget:alwaysOnTop')}
                  key={'widget.alwaysOnTop'}
                  onChange={() => onChange('widgetAlwaysOnTop')}/>
      ),
      (
          <Switch name={['setting', 'widget', 'freeze']}
                  config={{valuePropName: 'checked'}}
                  label={i18n.t('widget:freeze')}
                  key={'widget.freeze'}
                  onChange={() => onChange('widgetFreeze')}/>
      )
    ],
    [
      (
          <Switch name={['setting', 'widget', 'draggable']}
                  config={{valuePropName: 'checked'}}
                  label={i18n.t('widget:draggable')}
                  key={'widget.draggable'}
                  onChange={() => onChange('widgetDraggable')}/>
      ),
      (
          <Switch name={['setting', 'widget', 'resizable']}
                  config={{valuePropName: 'checked'}}
                  label={i18n.t('widget:resizable')}
                  key={'widget.resizable'}
                  onChange={() => onChange('resizable')}/>
      ),
      (
          <Switch name={['setting', 'widget', 'scrollable']}
                  config={{valuePropName: 'checked'}}
                  label={i18n.t('widget:scrollable')}
                  key={'widget.scrollable'}
                  onChange={() => onChange('widgetScrollable')}/>
      )
    ],
    [
      (
          <Switch name={['setting', 'widget', 'maximizable']}
                  config={{valuePropName: 'checked'}}
                  label={i18n.t('widget:maximizable')}
                  key={'widget.maximizable'}
                  onChange={() => onChange('widgetMaximizable')}/>
      ),
      (
          <Switch name={['setting', 'widget', 'zoomable']}
                  config={{valuePropName: 'checked'}}
                  label={i18n.t('widget:zoomable')}
                  key={'widget.zoomable'}
                  onChange={() => onChange('widgetZoomable')}/>
      ),
      (
          <InputNumber min={0}
                       max={10000}
                       label={i18n.t('widget:setLayer')}
                       key={'widget.setLayerUp'}
                       name={['setting', 'widget', 'setLayerUp']}
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
                       key={'widget.cellWidth'}
                       name={['setting', 'widget', 'cellWidth']}
                       onChange={() => onChange('widgetCellWidth')}/>
      ),
      (
          <InputNumber min={0}
                       max={10000}
                       label={i18n.t('widget:rowHeight')}
                       key={'widget.rowHeight'}
                       name={['setting', 'widget', 'rowHeight']}
                       onChange={() => onChange('widgetRowHeight')}/>
      )
    ],
    [
      (
          <Switch name={['setting', 'widget', 'stretchWidth']}
                  label={i18n.t('widget:stretchWidth')}
                  key={'widget.stretchWidth'}
                  config={{valuePropName: 'checked'}}
                  onChange={() => onChange('widgetStretchWidth')}/>
      ),
      (
          <Switch name={['setting', 'widget', 'stretchHeight']}
                  config={{valuePropName: 'checked'}}
                  label={i18n.t('widget:stretchHeight')}
                  key={'widget.stretchHeight'}
                  onChange={() => onChange('widgetStretchHeight')}/>
      )
    ],
    [
      (
          <Radio.Group buttonStyle={'solid'}
                       name={['setting', 'widget', 'unstick']}
                       label={i18n.t('widget:unStickLabel')}
                       key={'widget.unstick'}
                       onChange={() => onChange('widgetUnstick')}>
            <Radio.Button value={'widgetUnstick'}>
              <RedoOutlined/>
              {i18n.t('widget:unStick')}
            </Radio.Button>
          </Radio.Group>
      ),
      (
          <Radio.Group buttonStyle={'solid'}
                       name={['setting', 'widget', 'stick']}
                       label={i18n.t('widget:stick')}
                       key={'widget.stick'}
                       onChange={e => onChange(e.target.value)}>
            <div style={{marginBottom: 2}}>
              {_eventTooltip('widget:stickToTopLeft', <RadiusUpleftOutlined/>, 'stickToTopLeft')}
              {_eventTooltip('widget:stickToCenterTop', <BorderTopOutlined/>, 'stickToCenterTop')}
              {_eventTooltip('widget:stickToTopRight', <RadiusUprightOutlined/>, 'stickToTopRight')}
            </div>
            <div style={{marginBottom: 2}}>
              {_eventTooltip('widget:stickToCenterLeft', <BorderLeftOutlined/>, 'stickToCenterLeft')}
              {_eventTooltip('widget:stickToCenter', <BorderInnerOutlined/>, 'stickToCenter')}
              {_eventTooltip('widget:stickToCenterRight', <BorderRightOutlined/>, 'stickToCenterRight')}
            </div>
            <div style={{marginBottom: 2}}>
              {_eventTooltip('widget:stickToBottomLeft', <RadiusBottomleftOutlined/>, 'stickToBottomLeft')}
              {_eventTooltip('widget:stickToCenterBottom', <BorderBottomOutlined/>, 'stickToCenterBottom')}
              {_eventTooltip('widget:stickToBottomRight', <RadiusBottomrightOutlined/>, 'stickToBottomRight')}
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
