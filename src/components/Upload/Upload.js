import React from 'react';
import {withTranslation} from 'react-i18next';
import {Button, message, Upload} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import classnames from 'classnames';

import './upload.less';

class UploadFile extends React.Component {
  render() {

    const {
      t,
      fileList = [],
      limit = 1,
      type = 'image',
      preview = true,
      crop = true,
      listType = 'text',
      allowed = ['image/png', 'image/jpeg'],
      onFileChange,
      onFileRemove,
      className = '',
      previewUrl
    } = this.props;

    /**
     * @constant
     * @param file
     * @return {*}
     * @private
     */
    const _isImage = file => file.type.match(/image/);

    /**
     * @constant
     * @param file
     * @return {Promise<void>}
     */
    const onPreview = async file => {
      let src = file.url;
      if (!src) {
        src = await new Promise(resolve => {
          const reader = new FileReader();
          reader.readAsDataURL(file.originFileObj);
          reader.onload = () => resolve(reader.result);
        });
      }
      const image = new Image();
      image.src = src;
      const imgWindow = window.open(src);
      imgWindow.document.write(image.outerHTML);
    };

    let uploadProps = {
      fileList,
      listType,
      beforeUpload(file) {
        if (allowed.indexOf(file.type) < 0) {
          return message.error(t('form:uploadTypeError', {name: file.name}));
        }
        onFileRemove(file);
        onFileChange({file});
        return false;
      },
      onRemove(file) {
        onFileRemove(file);
      },
      progress: {
        strokeColor: {
          '0%': '#108ee9',
          '100%': '#87d068'
        },
        strokeWidth: 3,
        format: percent => `${parseFloat(percent.toFixed(2))}%`
      }
    };

    type === 'image' && preview && (uploadProps = {...uploadProps, ...{onPreview}});

    const _card = (<div><UploadOutlined/> {t('form:selectFile')}</div>);
    const _button = (
        <Button type={'primary'}>
          {_card}
        </Button>
    );

    const _upload = (
        <Upload {...uploadProps} className={classnames(className, 'site-upload')}>
          {fileList.length < limit && listType === 'picture-card' ? _card : _button}
        </Upload>
    );

    let _render = _upload;

    if (type === 'image') {
      _render = crop ? (
          <ImgCrop rotate>
            {_upload}
          </ImgCrop>
      ) : _upload;
    }

    return (
        <div className={'site-upload-wrapper'}>
          {previewUrl && (
              <div className={'site-upload-preview'}>
                <div className={'file-info'}>
                  <img src={previewUrl} alt={previewUrl}/>
                </div>
              </div>
          )}
          {_render}
        </div>
    );
  }
}

export default withTranslation()(UploadFile);
