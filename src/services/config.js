/**
 * @export
 * @return {{
 *  ANTHILL_KEY,
 *  SERVER_URL,
 *  ADMIN_URL,
 *  UI_URL,
 *  SERVER_PORT,
 *  ADMIN_PORT,
 *  UI_PORT,
 *  API
 * }}
 * @constructor
 */
export const API_CONFIG = () => {

  /**
   * API definition
   * @type {{
   *  ANTHILL_KEY,
   *  SERVER_URL,
   *  ADMIN_URL,
   *  UI_URL,
   *  SERVER_PORT,
   *  ADMIN_PORT,
   *  UI_PORT,
   *  API
   * }}
   */
  const {
    ANTHILL_KEY = 'anthill-key',
    SERVER_URL = 'http://localhost',
    ADMIN_URL = 'http://localhost',
    UI_URL = 'http://localhost',
    SERVER_PORT = 3000,
    ADMIN_PORT = 8001,
    UI_PORT = 8002,
    API = 'api/v1'
  } = process.env;

  return {
    ANTHILL_KEY,
    SERVER_URL,
    ADMIN_URL,
    UI_URL,
    SERVER_PORT,
    ADMIN_PORT,
    UI_PORT,
    API
  };
};

export const API = {
  auth: {
    getToken: 'auth',
    currentUser: 'current_user',
    registerUser: 'users',
    forceLogout: 'force_logout'
  },
  users: {
    getAllUsers: 'all_users',
    getUser: 'users/:userKey'
  },
  websites: {
    getWebsites: 'users/:userKey/websites',
    getWebsite: 'users/:userKey/websites/:websiteKey',
    getWebsiteWidgets: 'users/:userKey/websites/:websiteKey/widgets'
  },
  widgets: {
    getWidgets: 'users/:userKey/widgets',
    getWidget: 'users/:userKey/widgets/:widgetKey'
  }
};
