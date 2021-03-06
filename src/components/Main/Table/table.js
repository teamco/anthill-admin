import { Table } from 'antd';
import React from 'react';
import { withTranslation } from 'react-i18next';
import classnames from 'classnames';

import styles from '@/components/Main/Table/table.module.less';

/**
 * @function
 * @constructor
 * @param props
 * @return {JSX.Element}
 */
function MainTable(props) {

  /**
   * Add keys to dataSource
   * @type {[]}
   */
  const dataSource = props.data.map((entity, idx) => ({ ...entity, ...{ key: idx } }));

  /**
   * @constant
   * @param key
   * @return {{text: *, value: *}[]}
   */
  const filterBy = key => {
    const _filter = dataSource.map(data => ({
      text: data[key],
      value: data[key]
    }));

    return [
      ...new Map(_filter.map(item =>
        [item['value'], item])).values()
    ];
  };

  // specify the condition of filtering result
  // here is that finding the name started with `value`
  const onFilter = key => (value, record) => !record[key].indexOf(value);
  const sorter = key => (a, b) => a[key].length - b[key].length;

  const columns = (props.columns || []).map(column => {
    const _column = { ...column };

    if (column.filterable) {
      _column.filters = filterBy(column.key);
      _column.onFilter = onFilter(column.key);
    }

    if (column.sortable) {
      _column.sorter = sorter(column.key);
      _column.sortDirections = ['descend', 'ascend'];
    }

    delete _column.filterable;
    delete _column.sortable;

    return _column;
  });

  /**
   * @constant
   * @type {{actionsHovered, gridClassName, dataSource, data, columns, expandable, scroll}}
   */
  const gridProps = { ...props };
  gridProps.dataSource = dataSource;

  const total = gridProps.data.length;
  const gridClassName = gridProps.gridClassName;
  const scroll = gridProps.scroll;
  const actionsVisible = gridProps.actionsHovered;

  delete gridProps.gridClassName;
  delete gridProps.data;
  delete gridProps.columns;
  delete gridProps.scroll;
  delete gridProps.actionsHovered;

  return (
    <Table className={classnames(
      styles.grid,
      gridClassName,
      actionsVisible ? styles.hovered : ''
    )}
           expandable={gridProps.expandable}
           footer={() => `${props.t('table:total')}: ${total}`}
           columns={columns}
           scroll={scroll}
           {...gridProps} />
  );
}

export default withTranslation()(MainTable);
