/**
 * @constant
 * @type {Storage}
 */
const storage = window.sessionStorage;

/**
 * @export
 * @param {string} key
 * @param value
 */
export const addStore = (key, value) => {
  storage.setItem(key, value);
};

/**
 * @export
 * @param {string} key
 */
export const deleteStore = (key) => {
  storage.removeItem(key);
};

/**
 * @export
 * @param {string} key
 * @return {string}
 */
export const getStore = (key) => {
  return storage.getItem(key);
};

/**
 * @export
 * @param {string} key
 */
export const clearStore = (key) => {
  storage.clear();
};

