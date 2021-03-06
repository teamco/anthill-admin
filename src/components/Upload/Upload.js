import React from 'react';
import { withTranslation } from 'react-i18next';
import { Button, message, Upload } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import classnames from 'classnames';
import { cachedUrl } from '@/utils/file';

import styles from './upload.less';

class UploadFile extends React.Component {
  render() {

    const {
      t,
      disabled = false,
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
      disabled,
      fileList,
      listType,
      beforeUpload(file) {
        if (allowed.indexOf(file.type) < 0) {
          return message.error(t('form:uploadTypeError', { name: file.name }));
        }
        onFileRemove(file);
        onFileChange(file);
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

    type === 'image' && preview && (uploadProps = { ...uploadProps, ...{ onPreview } });

    const _card = (<div><UploadOutlined /> {t('form:selectFile')}</div>);
    const _button = (
      <Button type={'primary'}
              size={'small'}
              disabled={disabled}>
        {_card}
      </Button>
    );

    const _upload = (
      <Upload {...uploadProps}
              className={classnames(className, styles.siteUpload)}>
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

    /**
     * @constant
     * @param e
     */
    const handleRemove = e => {
      e.preventDefault();
      onFileRemove();
    };

    return (
      <div className={styles.siteUploadWrapper}>
        {previewUrl && (
          <div className={styles.siteUploadPreview}>
            <div className={styles.fileInfo}>
              <img src={cachedUrl(previewUrl)}
                   alt={previewUrl} />
            </div>
          </div>
        )}
        {_render}
        {previewUrl && (
          <Button type={'primary'}
                  danger
                  className={styles.fileDelete}
                  onClick={handleRemove}
                  icon={<DeleteOutlined />}
                  size={'small'} />
        )}
      </div>
    );
  }
}

export default withTranslation()(UploadFile);
