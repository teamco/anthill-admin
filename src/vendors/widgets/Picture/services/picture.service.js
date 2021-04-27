import filter from '@/vendors/widgets/Picture/config/picture.filter';

/**
 * @export
 * @param style
 * @param filterType
 * @param payload
 * @return {string}
 */
export const handleMultipleFilters = ({ style, filterType, payload }) => {
  let _selectedFilters = [];
  const newFilter = filter[filterType](
    payload.filter,
    payload.value,
    payload.unit
  );

  if (style.filter) {
    const _filter = style.filter;
    const idx = findFilterIdx({ style, filter: payload.filter });

    _selectedFilters = _filter.split(' ');

    idx > -1 ?
      _selectedFilters[idx] = newFilter :
      _selectedFilters.push(newFilter);
  } else {

    _selectedFilters.push(newFilter);
  }

  return _selectedFilters.join(' ');
};

/**
 * @export
 * @param style
 * @param payload
 * @return {number}
 */
export const findFilterIdx = ({ style, filter }) => {
  let _filter = style.filter.split(' ');
  let idx = -1;

  _filter.forEach((name, key) => {
    if (name.match(filter)) {
      idx = key;
    }
  });

  return idx;
};

/**
 * @export
 * @param selectedFilters
 * @param filter
 * @return {*}
 */
export const findFilter = ({ selectedFilters, filter }) => {
  return selectedFilters.find(selected => selected.filter === filter);
};

/**
 * @export
 * @param selectedFilters
 * @param filter
 * @return {*}
 */
export const removeFilter = ({ selectedFilters, filter }) => {
  return selectedFilters.filter(selected => selected.filter !== filter);
};
