import { API } from '@/services/config';
import request from '@/utils/request';
import i18n from '@/utils/i18n';
import { errorDeleteMsg, errorGetMsg, errorSaveMsg } from '@/utils/message';
import { getXHRToken } from '@/services/auth.service';

/**
 * @function
 * @export
 * @param {string} userKey
 * @param {string} token
 * @return {*}
 */
export async function getWebsites({ userKey, token }) {
  const opts = request.config({
    url: API.websites.getWebsites,
    headers: { 'Authorization': getXHRToken({ token }) },
    userKey
  });

  return request.xhr(opts,
    (error) => errorGetMsg(i18n.t('menu:websites'), error));
}

/**
 * @export
 * @param userKey
 * @param websiteKey
 * @param {string} token
 * @return {*}
 */
export function getWebsite({ userKey, websiteKey, token }) {
  const opts = request.config({
    url: API.websites.getWebsite,
    headers: { 'Authorization': getXHRToken({ token }) },
    websiteKey,
    userKey
  });

  return request.xhr(opts,
    (error) => errorGetMsg(i18n.t('instance:website'), error));
}

/**
 * @export
 * @param key
 * @return {Q.Promise<*>|undefined}
 */
export function getAssignedWidgets({ key }) {
  const opts = request.config({
    url: API.websites.getWebsiteWidgets,
    websiteKey: key
  });
  return request.xhr(opts,
    (error) => errorGetMsg(i18n.t('instance:website'), error));
}

/**
 * @export
 * @param entityForm
 * @param userKey
 * @param token
 * @param [fileList]
 * @param [tags]
 * @return {Promise<*>}
 */
export async function saveWebsite({ entityForm, fileList = [], tags = [], userKey, token }) {
  const opts = request.config({
    url: API.websites.getWebsites,
    headers: { 'Authorization': getXHRToken({ token }) },
    method: 'post',
    userKey
  });

  const picture = fileList[0] ? await request.toBase64(fileList[0]) : undefined;

  return request.xhr({
      ...opts, ...{
        data: {
          website: {
            name: entityForm.name,
            description: entityForm.description,
            key: entityForm.entityKey,
            tags: JSON.stringify(tags),
            picture
          }
        }
      }
    },
    (error) => errorSaveMsg(false, i18n.t('instance:website'), error)
  );
}

/**
 * @export
 * @param entityForm
 * @param token
 * @param removeFile
 * @param websiteKey
 * @param userKey
 * @param [fileList]
 * @param [tags]
 * @return {Promise<*>}
 */
export async function updateWebsite({ entityForm, fileList = [], tags = [], removeFile, token, websiteKey, userKey }) {
  const opts = request.config({
    url: API.websites.getWebsite,
    headers: { 'Authorization': getXHRToken({ token }) },
    method: 'put',
    websiteKey,
    userKey
  });

  const picture = fileList[0] ? await request.toBase64(fileList[0]) : undefined;

  return request.xhr({
      ...opts,
      ...{
        data: {
          website: {
            name: entityForm.name,
            description: entityForm.description,
            tags: JSON.stringify(tags),
            remove_picture: removeFile,
            picture
          }
        }
      }
    },
    (error) => errorSaveMsg(true, i18n.t('instance:website'), error)
  );
}

/**
 * @export
 * @param entityKey
 * @return {Promise<Q.Promise<*>|undefined>}
 */
export async function destroyWebsite({ token, websiteKey, userKey  }) {
  const opts = request.config({
    url: API.websites.getWebsite,
    headers: { 'Authorization': getXHRToken({ token }) },
    method: 'delete',
    websiteKey,
    userKey
  });

  return request.xhr(opts,
    (error) => errorDeleteMsg(i18n.t('instance:website'), error));
}

/**
 * @export
 * @param entityForm
 * @param widget_ids
 * @return {Promise<*>}
 */
export async function saveWebsiteWidgets({ entityForm, widget_ids = [] }) {
  const opts = request.config({
    url: API.websites.getWebsiteWidgets,
    method: 'post',
    websiteKey: entityForm.entityKey
  });

  return request.xhr({
      ...opts, ...{
        data: {
          website: {
            widget_ids,
            user_id: 1
          }
        }
      }
    },
    (error) => errorSaveMsg(false, i18n.t('website:assignWidgets'), error)
  );
}
