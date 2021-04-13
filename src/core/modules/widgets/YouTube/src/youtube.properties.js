import React from 'react';
import {Input} from 'antd';

import i18n from '@/utils/i18n';

import Iframe from '@/components/Iframe';

const {TextArea} = Input;

/**
 * @export
 * @param onUpdatePreview
 * @param youtubePreview
 * @param {boolean} [disabledUrl]
 * @return {JSX.Element[][]}
 */
export const youtubeProperties = (onUpdatePreview, youtubePreview, disabledUrl = false) => {
  return [
    [
      (
          <Input type={'text'}
                 label={i18n.t('form:name')}
                 name={'youtube/text'}
                 key={'youtubeText'}
                 config={{
                   rules: [
                     {required: true}
                   ]
                 }}/>
      )
    ],
    [
      (
          <TextArea label={i18n.t('form:embedUrl')}
                    name={'youtube/embedUrl'}
                    key={'youtubeUrl'}
                    disabled={disabledUrl}
                    onChange={onUpdatePreview}
                    autoSize={{
                      minRows: 4,
                      maxRows: 10
                    }}
                    type={'textarea'}/>
      )
    ],
    [
      (
          <Iframe label={i18n.t('form:preview')}
                  height={320}
                  key={'youtubePreview'}
                  src={youtubePreview}/>
      )
    ]
  ];
};
