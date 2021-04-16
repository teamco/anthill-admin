import i18n from '@/utils/i18n';
import request from '@/utils/request';
import { API } from '@/services/config';
import { errorGetMsg } from '@/utils/message';
import { getXHRToken } from '@/services/auth.service';

export const isAdmin = (user) => {
  return true;
};

/**
 * @export
 * @param token
 * @return {Q.Promise<*>|undefined}
 */
export function getCurrentUser({ token }) {
  const opts = request.config({
    url: API.auth.currentUser,
    headers: { 'Authorization': getXHRToken({ token }) }
  });
  return request.xhr(opts,
    () => errorGetMsg(i18n.t('menu:websites')),
    '/home'
  );
}

/**
 * @export
 * @async
 * @param {string} email
 * @param {string} protocol
 * @param {string} format
 * @return {Promise<*>}
 */
export async function getProfileImage({ email, protocol = 'http', format = 'json' }) {
  const gravatar = require('gravatar');
  return await gravatar.url(email, { protocol, format });
}
