import request from '@/utils/request';
import { API, API_CONFIG } from '@/services/config';
import { errorGetMsg } from '@/utils/message';
import i18n from '@/utils/i18n';
import { getStore } from '@/utils/storage';

/**
 * @constant
 * @type {{SERVER_PORT: number, API: string, SERVER_URL: string, ANTHILL_KEY: string}}
 */
const apiConfig = API_CONFIG();

/**
 * @export
 * @param {string} token
 * @return {string}
 */
export const getStoredToken = ({ token }) => {
  return token ? token : getStore(apiConfig.ANTHILL_KEY);
};

/**
 * @export
 * @param {string} token
 * @return {string}
 */
export const getXHRToken = ({ token }) => {
  token = getStoredToken({ token });
  return `Basic ${token}`;
};

/**
 * @function
 * @export
 * @param {string} email
 * @param {string} password
 * @return {*}
 */
export function getToken({ email, password }) {
  const opts = request.config({
    url: API.auth.getToken,
    method: 'post'
  });

  return request.xhr({
      ...opts, ...{
        data: {
          email,
          password
        }
      }
    },
    () => errorGetMsg(i18n.t('menu:websites')),
    '/home'
  );
}
