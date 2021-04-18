import { API } from '@/services/config';
import request from '@/utils/request';
import i18n from '@/utils/i18n';
import { errorDeleteMsg, errorGetMsg, errorSaveMsg } from '@/utils/message';
import { getXHRToken } from '@/services/auth.service';

/**
 * @function
 * @export
 * @param {string} token
 * @return {*}
 */
export function getWebsites({ token }) {
  const opts = request.config({
    url: API.websites.getAllWebsites,
    headers: { 'Authorization': getXHRToken({ token }) }
  });
  return request.xhr(
    opts,
    (error) => errorGetMsg(i18n.t('menu:websites'), error),
    '/home'
  );
}

/**
 * @export
 * @param key
 * @param {string} token
 * @return {*}
 */
export function getWebsite({ key, token }) {
  const opts = request.config({
    url: API.websites.getWebsite,
    headers: { 'Authorization': getXHRToken({ token }) },
    key
  });
  return request.xhr(
    opts,
    (error) => errorGetMsg(i18n.t('instance:website'), error),
    '/websites'
  );
}

/**
 * @export
 * @param key
 * @return {Q.Promise<*>|undefined}
 */
export function getAssignedWidgets({ key }) {
  const opts = request.config({
    url: API.websites.getWebsiteWidgets,
    key
  });
  return request.xhr(
    opts,
    (error) => errorGetMsg(i18n.t('instance:website'), error),
    '/websites'
  );
}

/**
 * @export
 * @param entityForm
 * @param [fileList]
 * @param [tags]
 * @return {Promise<*>}
 */
export async function saveWebsite({ entityForm, fileList = [], tags = [] }) {
  const opts = request.config({
    url: API.websites.saveWebsite,
    method: 'post'
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
            user_id: 1,
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
 * @param [fileList]
 * @param [tags]
 * @return {Promise<*>}
 */
export async function updateWebsite({ entityForm, fileList = [], tags = [], removeFile, token }) {
  const opts = request.config({
    url: API.websites.updateWebsite,
    headers: { 'Authorization': getXHRToken({ token }) },
    key: entityForm.entityKey,
    method: 'put'
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
export async function destroyWebsite({ entityKey }) {
  const opts = request.config({
    url: API.websites.destroyWebsite,
    key: entityKey,
    method: 'delete'
  });

  return request.xhr(opts,
    (error) => errorDeleteMsg(i18n.t('instance:website'), error)
  );
}

/**
 * @export
 * @param entityForm
 * @param widget_ids
 * @return {Promise<*>}
 */
export async function saveWebsiteWidgets({ entityForm, widget_ids = [] }) {
  const opts = request.config({
    url: API.websites.saveWebsiteWidgets,
    method: 'post',
    key: entityForm.entityKey
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
