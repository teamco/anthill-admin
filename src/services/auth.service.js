import request from '@/utils/request';
import { API } from '@/services/config';
import { errorGetMsg } from '@/utils/message';
import i18n from '@/utils/i18n';

/**
 * @function
 * @export
 * @param {string} email
 * @param {string} password
 * @return {*}
 */
export function getToken({email, password}) {
  const opts = request.config({
    url: API.auth.getToken,
    email,
    password
  });
  return request.xhr(
    opts,
    () => errorGetMsg(i18n.t('menu:websites')),
    '/home'
  );
}
