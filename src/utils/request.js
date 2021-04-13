const axios = require('axios');

/**
 * @type {{SERVER_URL, SERVER_PORT}}
 */
const { SERVER_URL = 'http://localhost', SERVER_PORT = 5000 } = process.env;

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
  return `${SERVER_URL}:${SERVER_PORT}/${url}`;
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
  isSuccess,
  adoptUrlToServer,
};
