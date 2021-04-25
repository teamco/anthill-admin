import React from 'react';
import { Input, Switch } from 'antd';

import i18n from '@/utils/i18n';

const { TextArea } = Input;

/**
 * @export
 * @param onChange
 * @return {*}
 */
export const mainProperties = ({ onChange }) => {
  const main = [
    [
      (
        <Input type={'text'}
               label={i18n.t('form:name')}
               key={'widgetName'}
               name={'widgetName'}
               config={{
                 rules: [
                   { required: true }
                 ]
               }} />
      ),
      (
        <Input type={'text'}
               label={i18n.t('form:contentKey')}
               disabled={true}
               key={'contentKey'}
               name={'contentKey'} />
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
                  type={'textarea'} />
      )
    ]
  ];

  const advanced = [
    [
      (
        <Input type={'text'}
               label={i18n.t('widget:clickOpenUrl')}
               key={'widget.clickOpenUrl'}
               name={['setting', 'widget', 'clickOpenUrl']} />
      )
    ],
    [
      (
        <Switch name={['setting', 'widget', 'statistics']}
                label={i18n.t('widget:statistics')}
                key={'widget.statistics'}
                config={{ valuePropName: 'checked' }}
                onChange={() => onChange('statistics')} />
      ),
      (
        <Switch name={'widgetHideContentOnInteraction'}
                label={i18n.t('widget:hideContentOnInteraction')}
                key={'widget.hideContentOnInteraction'}
                config={{ valuePropName: 'checked' }}
                onChange={() => onChange('hideOnInteraction')} />
      )
    ],
    [
      (
        <Switch name={['setting', 'widget', 'pageContainment']}
                label={i18n.t('widget:pageContainment')}
                key={'widget.pageContainment'}
                config={{ valuePropName: 'checked' }}
                onChange={() => onChange('pageContainment')} />
      ),
      (
        <Switch name={['setting', 'widget', 'showInMobile']}
                label={i18n.t('widget:showInMobile')}
                key={'widget.showInMobile'}
                config={{ valuePropName: 'checked' }}
                onChange={() => onChange('showInMobile')} />
      )
    ]
  ];

  return {
    main,
    advanced
  };
};
