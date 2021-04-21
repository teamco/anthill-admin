import { message } from 'antd';
import i18n from '@/utils/i18n';

/**
 * @constant
 * @export
 * @type {function(*): string}
 */
export const raiseConditionMsg = instance => i18n.t('error:notFound', { instance });

/**
 * @constant
 * @export
 * @type {string}
 */
export const raisePermissionMsg = i18n.t('error:noPermissions');


/**
 * @export
 * @param isEdit
 * @param instance
 */
export const successSaveMsg = (isEdit, instance) => {
  message.success(
    i18n.t(isEdit ? 'msg:successUpdate' : 'msg:successSave', { instance })
  ).then();
};

/**
 * @export
 * @param isEdit
 * @param instance
 * @param error
 */
export const errorSaveMsg = (isEdit, instance, error) => {
  message.error(error ? error :
    i18n.t(isEdit ?
      'msg:errorUpdate' :
      'msg:errorSave', { instance }
    )).then();
};

/**
 * @export
 * @param instance
 * @param error
 */
export const errorGetMsg = (instance, error) => {
  message.error(error ? error :
    i18n.t('msg:errorGet', { instance })).then();
};

/**
 * @export
 * @param instance
 * @param error
 */
export const errorDownloadMsg = (instance, error) => {
  message.error(error ? error :
    i18n.t('msg:errorDownload', { instance })).then();
};

/**
 * @export
 * @param instance
 */
export const successDeleteMsg = (instance) => {
  message.success(i18n.t('msg:successDelete', { instance })).then();
};

/**
 * @export
 * @param instance
 * @param error
 */
export const errorDeleteMsg = (instance, error) => {
  message.error(error ? error :
    i18n.t('msg:errorDelete', { instance })).then();
};
