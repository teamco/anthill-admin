import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

import { Input } from 'antd';

import UploadFile from '@/components/Upload';
import FormComponents from '@/components/Form';

const { GenericPanel } = FormComponents;
const { TextArea } = Input;

class MainGeneralPanel extends Component {

  render() {
    const {
      t,
      isEdit,
      upload,
      header,
      form,
      disabled = false,
      description = true,
      collapsed = false,
      panelName = 'general',
      extraField
    } = this.props;

    return (
      <GenericPanel header={header}
                    name={panelName}
                    defaultActiveKey={collapsed ? null : [panelName]}>
        <div>
          <Input type={'text'}
                 label={t('form:name')}
                 name={'name'}
                 form={form}
                 autoFocus
                 disabled={disabled}
                 config={{
                   rules: [
                     { required: true }
                   ]
                 }} />
          {isEdit && (
            <Input label={t('form:entityKey')}
                   disabled={true}
                   name={'entityKey'} />
          )}
        </div>
        <div>
          {description && (
            <TextArea label={t('form:description')}
                      disabled={disabled}
                      name={'description'}
                      style={{ minHeight: 100 }}
                      type={'textarea'} />
          )}
          {upload ? (
            <UploadFile label={t('form:upload')}
                        name={'upload'}
                        disabled={disabled}
                        fileList={upload.fileList}
                        previewUrl={upload.previewUrl}
                        onFileRemove={upload.onFileRemove}
                        onFileChange={upload.onBeforeUpload} />
          ) : null}
          {extraField}
        </div>
      </GenericPanel>
    );
  }
}

export default withTranslation()(MainGeneralPanel);
