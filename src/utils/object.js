/**
 * @export
 * @function
 * @param {Object} values
 * @param {[string]} keys
 * @param {number} nsDeep Start from index.
 * @example
 * const values = {
 *    phone: {
 *      area: 780,
 *      code: "+1",
 *      number: "56785"
 *    }
 * };
 * const keys = 'phone.number'.split('.');
 * const value = findObjectValue(values, keys, 0)
 * @return {*}
 */
export function findObjectValue(values, keys, nsDeep) {
  if (!values) {
    return values;
  }
  values = values[keys[nsDeep]];
  if (nsDeep < keys.length - 1) {
    nsDeep += 1;
    return findObjectValue(values, keys, nsDeep);
  } else {
    return values;
  }
}

/**
 * @export
 * @param entityForm
 * @param key
 * @return {*}
 */
export const fromForm = (entityForm, key) => {
  return (entityForm.find((form) => form.name === key) || {}).value;
};

/**
 * @export
 * @param form
 * @param model
 */
export const fillFormEffect = (model, form) => {
  const entityForm = model.entityForm;
  form.setFields(entityForm);
};

/**
 * @export
 * @param entity
 * @param [defaultValue]
 * @return {null|*}
 */
export const setAs = (entity, defaultValue = null) => {
  return typeof entity === 'undefined' ? defaultValue : entity;
};
