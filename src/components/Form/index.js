import GenericPanel from './GenericPanel';
import GenericTabs from './GenericTabs';
import EditableTags from './EditableTags';

/**
 * @export
 * @constant
 * @param value
 * @param [unit]
 * @param [DEFAULT_VALUE]
 * @return {string}
 */
export const unitFormatter = (value, unit = 'px', DEFAULT_VALUE = 0) => {
  return `${parseInt(value.toString(), 10) || DEFAULT_VALUE}${unit}`;
};

/**
 * @export
 * @constant
 * @param value
 * @param [unit]
 * @return {*}
 */
export const unitParser = (value, unit = 'px') => {
  const regex = new RegExp(unit, 'i');
  return value.replace(regex, '');
};

export default {
  GenericPanel,
  GenericTabs,
  EditableTags
};