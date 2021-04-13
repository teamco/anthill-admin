/**
 * @constant
 * @export
 * @param filter
 * @param value
 * @param [unit]
 * @return {string}
 */
export const cssFilter = (filter, value, unit = '') => `${filter}(${value}${unit})`;

/**
 * @export
 * @param filter
 * @param value
 * @param [unit]
 * @return {string}
 */
export const cssTransform = (filter, value, unit = '') => `${filter}(${value})${unit})`;

export const cssStyle = (filter, value) => {

};

export default {
  cssFilter,
  cssTransform
};