/**
 * @class LayoutIntersect
 */
export class LayoutIntersect {

  /**
   * Check intersect
   * @memberOf LayoutIntersect
   * @param {{column: number, relRight: number, row: number, relBottom: number}} src
   * @param {{column: number, relRight: number, row: number, relBottom: number}} target
   * @returns {boolean}
   * @private
   */
  _overlapped(src, target) {
    if (this._isNoOverlapped(src, target)) {
      return false;
    }
    return this._isOverlappedH(src, target) && this._isOverlappedV(src, target);
  }

  /**
   * Check if no overlapping
   * @memberOf LayoutIntersect
   * @param {{column: number, relRight: number, row: number, relBottom: number}} src
   * @param {{column: number, relRight: number, row: number, relBottom: number}} target
   * @returns {boolean}
   * @private
   */
  _isNoOverlapped(src, target) {

    /**
     * Define local instance
     * @type {boolean}
     */
    const noOverlapped =

        // horizontal
        (this._overlapCondition(target.column, src.relRight, '>') ||
            this._overlapCondition(target.relRight, src.column, '<')) ||

        // vertical
        (this._overlapCondition(target.row, src.relBottom, '>') ||
            this._overlapCondition(target.relBottom, src.row, '<'));

    this.layout.logger.log('Overlapping not possible', src, target, noOverlapped);
    return noOverlapped;
  }

  /**
   * Check Horizontal overlapping
   * @memberOf LayoutIntersect
   * @param {{column: number, relRight: number, row: number, relBottom: number}} src
   * @param {{column: number, relRight: number, row: number, relBottom: number}} target
   * @return {boolean}
   * @private
   */
  _isOverlappedH(src, target) {

    /**
     * Define local instance
     * @type {boolean}
     */
    const isOverlappedH = this._isOverlappedCore(src, target, 'column', 'relRight');
    this.layout.logger.log('Overlap H', src, target, isOverlappedH);
    return isOverlappedH;
  }

  /**
   * Check Vertical overlapping
   * @memberOf LayoutIntersect
   * @param {{column: number, relRight: number, row: number, relBottom: number}} src
   * @param {{column: number, relRight: number, row: number, relBottom: number}} target
   * @return {boolean}
   * @private
   */
  _isOverlappedV(src, target) {

    /**
     * Define local instance
     * @type {boolean}
     */
    const isOverlappedV = this._isOverlappedCore(src, target, 'row', 'relBottom');
    this.layout.logger.log('Overlap V', src, target, isOverlappedV);
    return isOverlappedV;
  }

  /**
   * Overlapping core
   * @memberOf LayoutIntersect
   * @param {{column: number, relRight: number, row: number, relBottom: number}} src
   * @param {{column: number, relRight: number, row: number, relBottom: number}} target
   * @param {string} from
   * @param {string} to
   * @returns {boolean}
   * @private
   */
  _isOverlappedCore(src, target, from, to) {
    return (this._overlapCondition(target[from], src[from], '>') &&
        this._overlapCondition(target[from], src[to], '<')) ||

        (this._overlapCondition(target[to], src[from], '>') &&
            this._overlapCondition(target[to], src[to], '<')) ||

        (this._overlapCondition(target[from], src[from], '<=') &&
            this._overlapCondition(target[to], src[to], '>='));
  }

  /**
   * Internal overlapping calc
   * @memberOf LayoutIntersect
   * @param {number} arg1
   * @param {number} arg2
   * @param {string} condition
   * @return {boolean}
   * @private
   */
  _overlapCondition(arg1, arg2, condition) {

    /**
     * Define anonymous function
     * @type {Function}
     * @private
     */
    const _fn = new Function('arg1', 'arg2', 'return arg1 ' + condition + ' arg2;');
    this.layout.logger.log('Overlap condition', _fn, arg1, arg2);
    return _fn(arg1, arg2);
  }

  /**
   * Check if overlapping was allowed
   * @param {Widget} src
   * @param {Widget} target
   * @returns {boolean}
   * @private
   */
  _allowOverlapping(src, target) {
    const targetPrefs = target.model.getConfig('preferences'),
        srcPrefs = src.model.getConfig('preferences');

    // allow overlapping
    return (targetPrefs.overlapping || srcPrefs.overlapping);
  }

  /**
   * Widget intersections
   * @memberOf LayoutIntersect
   * @param {Widget} source
   * @param {boolean} force
   * @returns {*}
   */
  intersectWidgets(source, force) {
    let move = {}, i = 0, l, target;

    /**
     * Define layout controller
     * @type {LayoutController}
     */
    const controller = this.layout.controller;

    /**
     * Define page
     * @type {Page}
     */
    const page = controller.getContainment();
    let partition = page.model.getItemsApartOf(source),
        overlapped;

    for (i, l = partition.length; i < l; i++) {

      /**
       * Define target widget
       * @type {Widget}
       */
      target = partition[i];

      if (!this._allowOverlapping(source, target) || force) {
        if (controller.isSnap2Grid() || controller.isUIGrid()) {
          overlapped = this.gridStyleOverlapping(source, target);
        } else if (controller.isFreeStyle()) {
          overlapped = this.freeStyleOverlapping(source, target);
        }

        if (overlapped) {
          move[target.model.getUUID()] = target;
        }
      }
    }
    return move;
  }

  /**
   * Grid style overlapping
   * @memberOf LayoutIntersect
   * @param source
   * @param target
   * @returns {*}
   */
  gridStyleOverlapping(source, target) {
    if (this._overlapped(source.dom, target.dom)) {
      this.layout.logger.log('Grid style Overlapped', target);
      return target;
    }
  }

  /**
   * Check free style overlapped widgets
   * @memberOf LayoutIntersect
   * @param source
   * @param target
   * @returns {*}
   */
  freeStyleOverlapping(source, target) {

    /**
     * Is overlapped?
     * @type {{collide(*, *): boolean, inside(*, *): boolean}}
     */
    const is = {

      /**
       * Check collide
       * @param el1
       * @param el2
       * @returns {boolean}
       */
      collide(el1, el2) {
        const rect1 = el1.getBoundingClientRect(),
            rect2 = el2.getBoundingClientRect();
        return !(
            rect1.top > rect2.bottom ||
            rect1.right < rect2.left ||
            rect1.bottom < rect2.top ||
            rect1.left > rect2.right
        );
      },

      /**
       * Check inside
       * @param el1
       * @param el2
       * @returns {boolean}
       */
      inside(el1, el2) {
        const rect1 = el1.getBoundingClientRect(),
            rect2 = el2.getBoundingClientRect();
        return (
            ((rect2.top <= rect1.top) && (rect1.top <= rect2.bottom)) &&
            ((rect2.top <= rect1.bottom) && (rect1.bottom <= rect2.bottom)) &&
            ((rect2.left <= rect1.left) && (rect1.left <= rect2.right)) &&
            ((rect2.left <= rect1.right) && (rect1.right <= rect2.right))
        );
      }
    };

    const $source = source.view.getDomElement(),
        $widget = target.view.getDomElement();

    if (is.collide($source, $widget) || is.inside($source, $widget)) {
      return target;
    }
  }
}