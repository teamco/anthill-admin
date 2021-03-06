import { API } from '@/services/config';
import request from '@/utils/request';
import i18n from '@/utils/i18n';

import { errorDeleteMsg, errorGetMsg, errorSaveMsg } from '@/utils/message';
import { getXHRToken } from '@/services/auth.service';

/**
 * @function
 * @export
 * @param userKey
 * @param token
 * @return {*}
 */
export function getWidgets({ userKey, token }) {
  const opts = request.config({
    url: API.widgets.getWidgets,
    headers: { 'Authorization': getXHRToken({ token }) },
    userKey
  });

  return request.xhr(opts,
    () => errorGetMsg(i18n.t('menu:widgets')));
}

/**
 * @export
 * @param userKey
 * @param widgetKey
 * @param token
 * @return {*}
 */
export function getWidget({ userKey, widgetKey, token }) {
  const opts = request.config({
    url: API.widgets.getWidget,
    headers: { 'Authorization': getXHRToken({ token }) },
    widgetKey,
    userKey
  });

  return request.xhr(opts,
    () => errorGetMsg(i18n.t('instance:website')));
}

/**
 * @export
 * @param entityForm
 * @param [fileList]
 * @param [tags]
 * @return {Promise<*>}
 */
export async function saveWidget({ entityForm, fileList = [], tags = [] }) {
  const opts = request.config({
    url: API.widgets.saveWidget,
    method: 'post'
  });

  const picture = fileList[0] ? await request.toBase64(fileList[0]) : undefined;

  return request.xhr({
      ...opts, ...{
        data: {
          widget: {
            name: entityForm.name,
            description: entityForm.description,
            key: entityForm.entityKey,
            width: entityForm.width,
            height: entityForm.height,
            tags: JSON.stringify(tags),
            user_id: 1,
            picture
          }
        }
      }
    },
    () => errorSaveMsg(false, i18n.t('instance:widget'))
  );
}

/**
 * @export
 * @param entityForm
 * @param [fileList]
 * @param [tags]
 * @return {Promise<*>}
 */
export async function updateWidget({ entityForm, fileList = [], tags = [] }) {
  const opts = request.config({
    url: API.widgets.updateWidget,
    key: entityForm.entityKey,
    method: 'put'
  });

  const picture = fileList[0] ? await request.toBase64(fileList[0]) : undefined;

  return request.xhr({
      ...opts, ...{
        data: {
          widget: {
            name: entityForm.name,
            description: entityForm.description,
            width: entityForm.width,
            height: entityForm.height,
            tags: JSON.stringify(tags),
            picture
          }
        }
      }
    },
    () => errorSaveMsg(true, i18n.t('instance:widget'))
  );
}

/**
 * @export
 * @param entityKey
 * @return {Promise<Q.Promise<*>|undefined>}
 */
export async function destroyWidget({ entityKey }) {
  const opts = request.config({
    url: API.widgets.destroyWidget,
    key: entityKey,
    method: 'delete'
  });

  return request.xhr(
    opts,
    () => errorDeleteMsg(i18n.t('instance:widget'))
  );
}
