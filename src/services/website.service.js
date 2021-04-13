import {API} from '@/services/config';
import request from '@/utils/request';
import i18n from '@/utils/i18n';
import {errorDeleteMsg, errorGetMsg, errorSaveMsg} from '@/utils/message';

/**
 * @function
 * @export
 * @return {*}
 */
export function getWebsites() {
  const opts = request.config({url: API.websites.getAllWebsites});
  return request.xhr(
      opts,
      () => errorGetMsg(i18n.t('menu:websites')),
      '/pages'
  );
}

/**
 * @export
 * @param key
 * @return {*}
 */
export function getWebsite({key}) {
  const opts = request.config({
    url: API.websites.getWebsite,
    key
  });
  return request.xhr(
      opts,
      () => errorGetMsg(i18n.t('instance:website')),
      '/pages/websites'
  );
}

/**
 * @export
 * @param key
 * @return {Q.Promise<*>|undefined}
 */
export function getAssignedWidgets({key}) {
  const opts = request.config({
    url: API.websites.getWebsiteWidgets,
    key
  });
  return request.xhr(
      opts,
      () => errorGetMsg(i18n.t('instance:website')),
      '/pages/websites'
  );
}

/**
 * @export
 * @param entityForm
 * @param [fileList]
 * @param [tags]
 * @return {Promise<*>}
 */
export async function saveWebsite({entityForm, fileList = [], tags = []}) {
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
      () => errorSaveMsg(false, i18n.t('instance:website'))
  );
}

/**
 * @export
 * @param entityForm
 * @param [fileList]
 * @param [tags]
 * @return {Promise<*>}
 */
export async function updateWebsite({entityForm, fileList = [], tags = []}) {
  const opts = request.config({
    url: API.websites.updateWebsite,
    key: entityForm.entityKey,
    method: 'put'
  });

  const picture = fileList[0] ? await request.toBase64(fileList[0]) : undefined;

  return request.xhr({
        ...opts, ...{
          data: {
            website: {
              name: entityForm.name,
              description: entityForm.description,
              tags: JSON.stringify(tags),
              picture
            }
          }
        }
      },
      () => errorSaveMsg(true, i18n.t('instance:website'))
  );
}

/**
 * @export
 * @param entityKey
 * @return {Promise<Q.Promise<*>|undefined>}
 */
export async function destroyWebsite({entityKey}) {
  const opts = request.config({
    url: API.websites.destroyWebsite,
    key: entityKey,
    method: 'delete'
  });

  return request.xhr(
      opts,
      () => errorDeleteMsg(i18n.t('instance:website'))
  );
}

/**
 * @export
 * @param entityForm
 * @param widget_ids
 * @return {Promise<*>}
 */
export async function saveWebsiteWidgets({entityForm, widget_ids = []}) {
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
      () => errorSaveMsg(false, i18n.t('website:assignWidgets'))
  );
}
