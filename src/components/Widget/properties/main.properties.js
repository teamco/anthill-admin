import React from 'react';
import {Input, Switch} from 'antd';

import i18n from '@/utils/i18n';

const {TextArea} = Input;

/**
 * @export
 * @param onChange
 * @return {*}
 */
export const mainProperties = ({onChange}) => {
  const main = [
    [
      (
          <Input type={'text'}
                 label={i18n.t('form:name')}
                 key={'widgetName'}
                 name={'widgetName'}
                 config={{
                   rules: [
                     {required: true}
                   ]
                 }}/>
      )
    ],
    [
      (
          <TextArea label={i18n.t('form:description')}
                    name={'widgetDescription'}
                    key={'widgetDescription'}
                    autoSize={{
                      minRows: 4,
                      maxRows: 10
                    }}
                    type={'textarea'}/>
      )
    ],
    [
      (
          <Input type={'text'}
                 label={i18n.t('form:entityKey')}
                 disabled={true}
                 key={'entityKey'}
                 name={'entityKey'}/>
      ),
      (
          <Input type={'text'}
                 label={i18n.t('form:contentKey')}
                 disabled={true}
                 key={'contentKey'}
                 name={'contentKey'}/>
      )
    ]
  ];

  const advanced = [
    [
      (
          <Input type={'text'}
                 label={i18n.t('widget:clickOpenUrl')}
                 key={'widgetClickOpenUrl'}
                 name={'widgetClickOpenUrl'}/>
      )
    ],
    [
      (
          <Switch name={'widgetStatistics'}
                  label={i18n.t('widget:statistics')}
                  key={'widgetStatistics'}
                  config={{valuePropName: 'checked'}}
                  onChange={() => onChange('statistics')}/>
      ),
      (
          <Switch name={'widgetHideContentOnInteraction'}
                  label={i18n.t('widget:hideContentOnInteraction')}
                  key={'widgetHideContentOnInteraction'}
                  config={{valuePropName: 'checked'}}
                  onChange={() => onChange('hideOnInteraction')}/>
      )
    ],
    [
      (
          <Switch name={'widgetPageContainment'}
                  label={i18n.t('widget:pageContainment')}
                  key={'widgetPageContainment'}
                  config={{valuePropName: 'checked'}}
                  onChange={() => onChange('pageContainment')}/>
      ),
      (
          <Switch name={'widgetShowInMobile'}
                  label={i18n.t('widget:showInMobile')}
                  key={'widgetShowInMobile'}
                  config={{valuePropName: 'checked'}}
                  onChange={() => onChange('showInMobile')}/>
      )
    ]
  ];

  return {
    main,
    advanced
  };
};
