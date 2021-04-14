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
