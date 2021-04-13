import filter from '@/widgets/Picture/src/picture.filter';

/**
 * @export
 * @param style
 * @param filterType
 * @param payload
 * @return {string}
 */
export const handleMultipleFilters = ({style, filterType, payload}) => {
  let _selectedFilters = [];
  const newFilter = filter[filterType](
      payload.filter,
      payload.value,
      payload.unit
  );

  if (style.filter) {
    const _filter = style.filter;
    const idx = findFilterIdx(style, payload);

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
export const findFilterIdx = (style, payload) => {
  let _filter = style.filter.split(' ');
  let idx = -1;
  _filter.forEach((filter, key) => {
    if (filter.match(payload.filter)) {
      idx = key;
    }
  });

  return idx;
};
