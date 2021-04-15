import React, {Component} from 'react';
import {withTranslation} from 'react-i18next';

import {Input} from 'antd';

import UploadFile from '@/components/Upload';
import FormComponents from '@/components/Form';

const {GenericPanel} = FormComponents;
const {TextArea} = Input;

class MainGeneralPanel extends Component {

  render() {
    const {t, isEdit, upload, header, form} = this.props;

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
                            disabled={upload.disabled}
                            fileList={upload.fileList}
                            previewUrl={upload.previewUrl}
                            onFileRemove={upload.onFileRemove}
                            onFileChange={upload.onBeforeUpload}/>
            ) : null}
          </div>
        </GenericPanel>
    );
  }
}

export default withTranslation()(MainGeneralPanel);
