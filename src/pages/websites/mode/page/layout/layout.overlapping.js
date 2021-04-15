/**
 * Created with JetBrains RubyMine.
 * User: teamco
 * Date: 3/1/13
 * Time: 11:57 PM
 */

import {LayoutIntersect} from './layout.intersect';

/**
 * @class LayoutOverlapping
 * @extends LayoutIntersect
 */
export class LayoutOverlapping extends LayoutIntersect {
  constructor(layout) {
    super();

    /**
     * @property LayoutOverlapping
     * @type {PageLayout}
     */
    this.layout = layout;
  }

  /**
   * Define exit point
   * @memberOf LayoutOverlapping
   * @param opts
   * @returns {*}
   * @private
   */
  _exitPointOn(opts) {
    if (opts.condition) {
      this.layout.logger.log(opts.log);
    }
    return opts.condition;
  }

  /**
   * Nested organizer
   * @memberOf LayoutOverlapping
   * @param {{targets: Object, callback: Function}} opts
   * @returns {*}
   */
  nestedOrganizer(opts) {
    if (this.layout.controller.isLoading()) {
      this.layout.controller.readyToOrganize();
      return false;
    }

    /**
     * Define layout
     * @type {PageLayout}
     */
    const layout = this.layout;

    opts = opts || {};
    opts.targets = opts.targets || {};

    /**
     * Define not organize
     */
    const notOrganize = this._exitPointOn({
      log: 'Do not organize',
      condition: !opts.organize
    });

    /**
     * Define not overlapping
     */
    const notOverlapping = this._exitPointOn({
      log: 'LayoutOverlapping is allowed',
      condition: !layout.controller.isOverlappingAllowed()
    });

    /**
     * Define empty targets
     */
    const emptyTargets = this._exitPointOn({
      log: 'Empty targets',
      condition: !Object.keys(opts.targets).length
    });

    if (notOrganize || notOverlapping || emptyTargets) {
      this._nestedOrganizerCallback(opts.callback);
      return false;
    }

    layout.logger.log('Starting nested organizer', opts);
    this.nestedOrganizer({
      targets: this._nestedOrganizerCore(opts.targets),
      callback: opts.callback,
      organize: opts.organize
    });
  }

  /**
   * Nested organizer core
   * @memberOf LayoutOverlapping
   * @param {{}} widgets
   * @private
   * @returns {{}}
   */
  _nestedOrganizerCore(widgets) {
    let intersecting = {}, nestedMove = {},
        index, moved, widget;

    for (index in widgets) {
      if (Object.prototype.hasOwnProperty.call(widgets, index)) {

        /**
         * Define source widget
         * @type {Widget}
         */
        const src = widgets[index];

        /**
         * Find intersections
         * @type {*}
         */
        intersecting = this.intersectWidgets(src, false);
        this._organizeCollector(src, intersecting);

        for (moved in intersecting) {
          if (Object.prototype.hasOwnProperty.call(intersecting, moved)) {

            /**
             * Define intersected widget
             * @type {Widget}
             */
            widget = intersecting[moved];

            /**
             * Collect widgets are ready to change position
             */
            nestedMove[widget.model.getUUID()] = widget;
          }
        }
      }
    }
    return nestedMove;
  }

  /**
   * Nested organizer callback
   * @memberOf LayoutOverlapping
   * @param {Function} [callback]
   * @private
   */
  _nestedOrganizerCallback(callback) {
    const layout = this.layout,
        emptySpaces = layout.controller.getBehavior().emptySpaces;

    if (emptySpaces) {
      layout.logger.log('Remove empty spaces');

      switch (emptySpaces) {
        case layout.containment.ORGANIZE_MODES.row:
          layout.logger.log('Remove empty rows');
          layout.emptyRows.remove();
          break;
        case layout.containment.ORGANIZE_MODES.column:
          layout.logger.log('Remove empty columns');
          layout.emptyColumns.remove();
          break;
        case layout.containment.ORGANIZE_MODES.none:
          break;
      }
    }
    this._cssOrganizer(callback);
    return true;
  }

  /**
   * Organize widget css
   * @memberOf LayoutOverlapping
   * @private
   */
  _cssOrganizer(callback) {
    const page = this.layout.controller.getContainment(),
        widgets = page.model.getItems(),
        length = Object.keys(widgets).length;

    let counter = 1;
    for (let index in widgets) {
      if (Object.prototype.hasOwnProperty.call(widgets, index)) {
        const widget = page.model.getItemByUUID(widgets[index].model.getUUID());
        widget.logger.log('Start nested organizer animation');
        widget.view.get$item()._setPosition({
          animate: true,
          callback: this._cssOrganizeCallback.bind({
            scope: this,
            widget: widget,
            callback: callback,
            save: counter === length
          })
        });
        counter += 1;
      }
    }
  }

  /**
   * Organize widget css callback
   * @memberOf LayoutOverlapping
   * @private
   */
  _cssOrganizeCallback() {

    const layout = this.scope.layout,
        callback = this.callback;

    if (callback) {
      layout.logger.log('Execute callback', callback);
      callback();
    }

    this.widget.view.get$item().setOpacity(1.0);

    if (this.save) {
      layout.logger.log('Finish nested organizer');
      layout.observer.publish(layout.eventManager.eventList.afterNestedOrganizer);
    }
  }

  /**
   * Organize collector
   * @memberOf LayoutOverlapping
   * @param {Widget} source
   * @private
   * @param {*} targets
   */
  _organizeCollector(source, targets) {

    const layout = this.layout;

    for (let index in targets) {
      if (Object.prototype.hasOwnProperty.call(targets, index)) {
        if (layout.controller.isSnap2Grid() || layout.controller.isUIGrid()) {

          this._snap2gridOrganizer(this.layout.controller.getBehavior(), source, targets[index],
              this.layout.controller.getGridWidth());

        } else if (layout.controller.isFreeStyle()) {
          // TODO
        } else {
          this.layout.logger.warn('Unable to get page', page);

          /**
           * Unset targets to prevent infinity loop
           * @type {{}}
           */
          targets = {};
        }
      }
    }
  }

  /**
   * Snap to grid organizer
   * @memberOf LayoutOverlapping
   * @param {{organize}} behavior
   * @param {{dom}} source
   * @param {{map, dom}} widget
   * @param {Number} max
   * @private
   */
  _snap2gridOrganizer(behavior, source, widget, max) {

    /**
     * Define local cell dims
     * @type {Number}
     */
    const cell = this.layout.controller.minCellWidth() + this.layout.config.grid.margin;

    /**
     * Organize by row
     * @param {{top: Number, bottom: Number, height: Number, row: Number, relHeight: Number, relBottom: Number}} dom
     * @param {{dom}} source
     * @param {{map}} widget
     * @private
     */
    function _organizeByRow(dom, source, widget) {
      dom.row = this.bottom(source.dom) + 1;
      dom.top = widget.map.widgetTop(dom.row);
      dom.bottom = dom.top + dom.height;
      dom.relHeight = widget.map.relHeight(dom.height, cell);
      dom.relBottom = widget.map.relBottom(dom.row, dom.relHeight);
    }

    if (behavior.organize === 'column') {
      const column = widget.dom.column,
          left = widget.dom.left,
          right = widget.dom.right;

      widget.dom.column = this.right(source.dom) + 1;
      widget.dom.left = widget.map.widgetLeft(widget.dom.column);
      widget.dom.right = widget.map.widgetRight(widget.dom.left, widget.dom.width);
      widget.dom.relWidth = widget.map.relWidth(widget.dom.width, cell);
      widget.dom.relRight = widget.map.relRight(widget.dom.column, widget.dom.relWidth);

      if (widget.dom.right >= max) {
        widget.dom.column = column;
        widget.dom.left = left;
        widget.dom.right = right;

        // Organize by row
        _organizeByRow.call(this, widget.dom, source, widget);
      }
    } else if (behavior.organize === 'row') {

      // Organize by row
      _organizeByRow.bind(this)(widget.dom, source, widget);
    } else {
      this.layout.logger.warn('Unable to get page', page);
    }
  }

  /**
   * Get right position
   * @memberOf LayoutOverlapping
   * @param {{column: Number, relWidth: Number}} target
   * @returns {number}
   */
  right(target) {
    return (target.column + target.relWidth - 1);
  }

  /**
   * Get bottom position
   * @memberOf LayoutOverlapping
   * @param {{row: Number, relHeight: Number}} target
   * @returns {number}
   */
  bottom(target) {
    return (target.row + target.relHeight - 1);
  }
}