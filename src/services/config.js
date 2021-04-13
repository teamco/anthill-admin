/**
 * @export
 * @return {{SERVER_PORT: number, API: string, SERVER_URL: string}}
 * @constructor
 */
export const API_CONFIG = () => {
  /**
   * API definition
   * @type {{SERVER_URL, SERVER_PORT, API}}
   */
  const {
    SERVER_URL = 'http://localhost',
    SERVER_PORT = 3000,
    API = 'api/v1'
  } = process.env;

  return {
    SERVER_URL,
    SERVER_PORT,
    API
  };
};

export const API = {
  auth: {
    getToken: 'auth'
  },
  websites: {
    getAllWebsites: 'websites',
    getWebsite: 'websites/:id',
    getWebsiteWidgets: 'websites/:id/widgets',
    saveWebsiteWidgets: 'websites/:id/widgets',
    updateWebsite: 'websites/:id',
    destroyWebsite: 'websites/:id',
    saveWebsite: 'websites'
  },
  widgets: {
    getAllWidgets: 'widgets',
    getWidget: 'widgets/:id',
    updateWidget: 'widgets/:id',
    destroyWidget: 'widgets/:id',
    saveWidget: 'widgets'
  }
};
