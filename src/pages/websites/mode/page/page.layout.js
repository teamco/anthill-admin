import {merge} from 'lodash';
import i18n from '@/utils/i18n';
import Logger from '@/core/modules/Logger';

import {LayoutOverlapping} from './layout/layout.overlapping';
import {LayoutEmptyRows} from './layout/layout.empty.rows';
import {LayoutEmptyColumns} from './layout/layout.empty.columns';

/**
 * @constant
 * @type {*}
 */
const LAYOUT_MODES = {
  snap2grid: {
    key: 'snap2grid',
    name: i18n.t('layout:snap2grid')
  },
  freeStyle: {
    key: 'freeStyle',
    name: i18n.t('layout:freeStyle')
  },
  floatRight: {
    key: 'floatRight',
    name: i18n.t('layout:floatRight')
  },
  floatLeft: {
    key: 'floatLeft',
    name: i18n.t('layout:floatLeft')
  }
};

/**
 * @constant
 * @type {*}
 */
const ORGANIZE_MODES = {
  none: {
    key: 'none',
    name: i18n.t('layout:none')
  },
  row: {
    key: 'row',
    name: i18n.t('layout:row')
  },
  column: {
    key: 'column',
    name: i18n.t('layout:column')
  }
};

/**
 * @constant
 * @type {*}
 */
const CONSTANTS = {
  organizeBy: [
    ORGANIZE_MODES.none,
    ORGANIZE_MODES.row,
    ORGANIZE_MODES.column
  ],
  emptySpacesBy: [
    ORGANIZE_MODES.none,
    ORGANIZE_MODES.row,
    ORGANIZE_MODES.column
  ]
};

/**
 * @constant
 * @type {*}
 */
const DEFAULTS = {
  type: 'default',
  limit: true,
  modes: LAYOUT_MODES,
  organize: CONSTANTS,
  grid: {
    additionalRows: 1,
    margin: 1
  }
};

export default class PageLayout {

  constructor(opts = {}, page) {

    /**
     * @property PageLayout
     * @type {Logger}
     */
    this.logger = new Logger(this);

    this.page = page;
    this.config = merge({}, DEFAULTS, opts);

    /**
     * Define overlapping
     * @property PageLayout
     * @type {LayoutOverlapping}
     */
    this.overlapping = new LayoutOverlapping(this);

    /**
     * Define empty rows
     * @property PageLayout
     * @type {LayoutEmptyRows}
     */
    this.emptyRows = new LayoutEmptyRows(this);

    /**
     * Define empty columns
     * @property PageLayout
     * @type {LayoutEmptyColumns}
     */
    this.emptyColumns = new LayoutEmptyColumns(this);
  }

  pageWidth(width) {
    const windowWidth = window.innerWidth;
    const parsedWidth = parseInt(width, 10);
    if (parsedWidth > 0) {
      if (width.match(/px/)) {
        return parsedWidth;
      } else if (width.match(/%/)) {
        return (windowWidth * parsedWidth) / 100;
      }
    }
  }

  /**
   * @memberOf PageLayout
   * @param width
   * @param columns
   * @return {number}
   */
  cellWidth(width, columns) {
    const grid = this.config.grid,
        margin = grid.margin;

    grid.cellWidth = ((this.pageWidth(width) - margin * columns) / columns).toFixed(2);

    this.logger.info('Calculated cell size (px)', grid.cellWidth);
    return grid.cellWidth;
  }
}
