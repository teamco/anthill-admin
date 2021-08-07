import { API_CONFIG } from '@/services/config';

/**
 * @constant
 * @type {{SERVER_PORT: number, API: string, SERVER_URL: string, ANTHILL_KEY: string}}
 */
const apiConfig = API_CONFIG();

const railsServer = `${apiConfig.SERVER_URL}:${apiConfig.SERVER_PORT}`;

/**
 * @constant
 * @param api
 * @return {*}
 */
const proxyOpts = api => ({
  target: api,
  changeOrigin: true,
  cookieDomainRewrite: 'localhost',
  secure: false,

  /**
   * @link https://sdk.gooddata.com/gooddata-ui/docs/4.1.1/ht_configure_webpack_proxy.html
   * @param proxyReq
   * @param req
   * @param res
   */
  onProxyRes(proxyReq, req, res) {

    // Browsers may send Origin headers even with same-origin
    // requests. To prevent CORS issues, we have to change
    // the Origin to match the target URL.
    // if (proxyReq.getHeader('origin')) {
    //   proxyReq.setHeader('origin', api);
    // }
  }
});

const routes = {
  api: railsServer,
  uploads: railsServer,
  users: railsServer
};

const proxy = {};

Object.keys(routes).forEach((server) => {
  proxy[`/${server}`] = proxyOpts(routes[server]);
});

// console.log(proxy);

export default proxy;
