import {API} from '@/services/config';
import request from '@/utils/request';
import i18n from '@/utils/i18n';
import {errorDeleteMsg, errorGetMsg, errorSaveMsg} from '@/utils/message';

/**
 * @function
 * @export
 * @param key
 * @return {*}
 */
export function getWidgets({key}) {
  const opts = request.config({
    url: API.widgets.getAllWidgets,
    key
  });
  return request.xhr(
      opts,
      () => errorGetMsg(i18n.t('menu:widgets')),
      '/pages'
  );
}

/**
 * @export
 * @param key
 * @return {*}
 */
export function getWidget({key}) {
  const opts = request.config({
    url: API.widgets.getWidget,
    key
  });
  return request.xhr(
      opts,
      () => errorGetMsg(i18n.t('instance:website')),
      '/pages/widgets'
  );
}

/**
 * @export
 * @param entityForm
 * @param [fileList]
 * @param [tags]
 * @return {Promise<*>}
 */
export async function saveWidget({entityForm, fileList = [], tags = []}) {
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
export async function updateWidget({entityForm, fileList = [], tags = []}) {
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
export async function destroyWidget({entityKey}) {
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
