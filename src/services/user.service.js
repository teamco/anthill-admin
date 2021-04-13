import request from '@/utils/request';
import { API } from '@/services/config';
import { errorGetMsg } from '@/utils/message';
import i18n from '@/utils/i18n';

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
    url: API.auth.user,
    headers: { 'Authorization': token }
  });
  return request.xhr(opts,
    () => errorGetMsg(i18n.t('menu:websites')),
    '/home'
  );
}
