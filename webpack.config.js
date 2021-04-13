const path = require('path');

/**
 * @function
 * @param alias
 * @return {string}
 * @private
 */
function _resolve(alias) {
  return path.resolve(__dirname, alias);
}

/**
 * WEBStorm IDEA Cannot support alias .
 * @example :
 * import PageHeader from '@/components/PageHeader';
 * @type {{resolve: {alias: {'@': string}}}}
 */
module.exports = {
  resolve: {
    alias: {
      '@': _resolve('src')
    }
  }
};
