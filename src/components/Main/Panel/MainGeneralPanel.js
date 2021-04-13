import React, {Component} from 'react';
import {withTranslation} from 'react-i18next';

import {Input} from 'antd';

import {localeDateTimeString} from '@/utils/state';
import UploadFile from '@/components/Upload';
import FormComponents from '@/components/Form';

const {GenericPanel} = FormComponents;
const {TextArea} = Input;

class MainGeneralPanel extends Component {

  render() {
    const {t, isEdit, upload, timestamp, header, form} = this.props;

    return (
        <GenericPanel header={header}
                      name={'general'}
                      defaultActiveKey={['general']}>
          <div>
            <Input type={'text'}
                   label={t('form:name')}
                   name={'name'}
                   form={form}
                   autoFocus
                   config={{
                     rules: [
                       {required: true}
                     ]
                   }}/>
            {isEdit && (
                <Input label={t('form:entityKey')}
                       disabled={true}
                       name={'entityKey'}/>
            )}
          </div>
          <div>
            <TextArea label={t('form:description')}
                      name={'description'}
                      style={{minHeight: 100}}
                      type={'textarea'}/>
            {upload ? (
                <UploadFile label={t('form:upload')}
                            name={'upload'}
                            fileList={upload.fileList}
                            previewUrl={upload.previewUrl}
                            onFileRemove={upload.onFileRemove}
                            onFileChange={upload.onBeforeUpload}/>
            ) : null}
          </div>
          {isEdit && timestamp ? (
              <div>
                <div label={t('form:createdAt')}
                     name={'createdAt'}>
                  {localeDateTimeString(timestamp.created_at)}
                </div>
              </div>
          ) : null}
        </GenericPanel>
    );
  }
}

export default withTranslation()(MainGeneralPanel);
