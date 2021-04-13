import { API_CONFIG } from '@/services/config';

const axios = require('axios');

/**
 * @constant
 * @type {{SERVER_PORT: number, API: string, SERVER_URL: string, ANTHILL_KEY: string}}
 */
const apiConfig = API_CONFIG();

/**
 * @function
 * @return {string}
 * @private
 */
function _csrfParam() {
  const meta = document.querySelector('meta[name="csrf-param"]');
  return meta.getAttribute('content');
}

/**
 * @function
 * @return {string}
 * @private
 */
function _csrfToken() {
  const meta = document.querySelector('meta[name="csrf-token"]');
  return meta.getAttribute('content');
}

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json;charset=UTF-8',
  'Access-Control-Allow-Origin': '*',
  accept: 'application/json',
};

/**
 * @constant
 * @return {{'Access-Control-Allow-Origin': string, 'Content-Type': string, accept: string}}
 */
const mergeHeaders = () => {
  // DEFAULT_HEADERS['X-CSRF-Token'] = _csrfToken();
  return DEFAULT_HEADERS;
};

/**
 * @function
 * @param url
 * @param key
 * @return {*}
 */
function adaptUrlToParams(url, key) {
  return url.replace(/:id/, key);
}

/**
 * @function
 * @param url
 * @return {string}
 */
function adoptUrlToServer(url) {
  return `${apiConfig.SERVER_URL}:${apiConfig.SERVER_PORT}/${apiConfig.API}/${url}`;
}

/**
 * @function
 * @param {string} url
 * @param {string} [method]
 * @param [headers]
 * @param [args]
 * @return {{headers, method: string, url: *}}
 */
function config({ url, method = 'get', headers = {}, ...args }) {
  if (url.match(/:id/)) {
    url = adaptUrlToParams(url, args.key);
  }

  return {
    ...{
      url: adoptUrlToServer(url),
      method,
      responseType: 'json',
      headers: { ...mergeHeaders(), ...headers },
    },
    ...args,
  };
}

/**
 * @function
 * @param file
 * @return {Promise<unknown>}
 */
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

/**
 * @function
 * @param opts
 * @param [errorMsg]
 * @param [fallbackUrl]
 * @return {Q.Promise<any> | undefined}
 */
function xhr(opts, errorMsg, fallbackUrl) {
  return axios(opts).catch(() => {
    errorMsg && errorMsg();
    setTimeout(() => {
      // fallbackUrl && (window.location.href = fallbackUrl);
    }, 2000);
  });
}

/**
 * @function
 * @param status
 * @return {boolean}
 */
function isSuccess(status) {
  return [200, 201, 202, 203, 204].indexOf(status) > -1;
}

export default {
  xhr,
  config,
  toBase64,
  isSuccess,
  adoptUrlToServer,
};
