import {isDevelopment} from '@/services/common.service';

/**
 * @constructor
 * @class Logger
 */
export default class Logger {

  /**
   * @constructor
   * @param scope
   */
  constructor(scope) {

    /**
     * @property Logger
     * @type {*}
     */
    this.scope = scope;

    /**
     * @property Logger
     * @type {window.console}
     */
    this.console = window['console'];

    /**
     * @property Logger
     */
    this.log = (...args) => console.log(...args);

    /**
     * @property Logger
     */
    this.info = (...args) => console.log(...args);

    /**
     * @property Logger
     */
    this.error = (...args) => console.log(...args);

    /**
     * @property Logger
     */
    this.warn = (...args) => console.log(...args);

    this.setConfig((scope.config || {}).logger || {
      handle: false,
      show: true,
      namespaces: false,
      type: {
        log: isDevelopment(),
        info: false,
        error: true,
        warn: true
      }
    });
  }

  /**
   * @static
   * @param scope
   * @param level
   * @param value
   * @return {*}
   */
  static global(scope, level, value) {
    const logger = new Logger(scope);
    return logger[level](value);
  }

  /**
   * Stack trace parser
   * @memberOf Logger.stackIt
   * @param {Array} stacks
   * @returns {Array}
   */
  static stackIt(stacks) {
    let log = [];

    for (let i = 1, l = stacks.length; i < l; i++) {
      log.push(stacks[i].replace(/^\s+at |\s+$/g, ''));
    }

    return log;
  }

  /**
   * Set config
   * @memberOf Logger
   * @param config
   */
  setConfig(config) {
    const protoConfig = {...this.constructor.prototype.config};
    this.config = {...config};

    if (Object.keys(config || {}).length) {
      if (!Object.keys(protoConfig || {}).length) {

        /**
         * Define cross items logger config
         * @property Logger
         * @type {*}
         */
        this.constructor.prototype.config = config;
      }
    } else if (protoConfig) {

      /**
       * Define config
       * @type {*}
       */
      this.config = protoConfig;
    }

    this.defineLogs();
  }

  /**
   * Show Log
   * @memberOf Logger.showLog
   * @returns {boolean}
   */
  showLog() {
    return this.config.show;
  }

  /**
   * Check if log available
   * @memberOf Logger.isLoggable
   * @return {Boolean}
   */
  isLoggable() {
    return this.console && this.showLog();
  }

  /**
   * Puts (internal function)
   * @memberOf Logger.puts
   * @param {string} type
   * @returns {boolean}
   */
  puts(type) {
    const config = this.config,
        scope = this.scope,
        log = this.isLoggable();

    let content = [],
        hash = {};

    if (log && config.type[type]) {
      try {
        if (config.namespaces) {

          /**
           * Define constructor name instance
           * @type {Function.name|*}
           */
          const instance = scope.name;

          if (instance) {
            config.namespaces = config.namespaces || [config.namespaces];
            if (config.namespaces.indexOf(instance) < 0) {
              return false;
            }
          }
        }

        let args = [], i = 1;

        for (i; i < arguments.length; i += 1) {
          args.push(arguments[i]);
        }

        if (this.console[type]) {
          hash[type] = args;
          content.push(hash);
        } else {
          content.push({log: args});
        }

        if (type === 'error' && this.console.trace) {
          content.push({trace: args});
        }

      } catch (e) {

        if (this.console.error) {
          content.push({
            error: [e, arguments]
          });
        }
      }
    }

    let i = 0;
    const l = content.length;

    if (!l) {
      return false;
    }

    this.console.groupCollapsed(scope);

    /**
     * @constant caller
     */
    const caller = require('caller-id');

    for (i; i < l; i += 1) {
      hash = content[i];
      const k = Object.keys(hash)[0];

      hash[k]['caller'] = caller.getData();
      hash[k]['line'] = Logger.stackIt(((new Error).stack + '').split('\n'));

      this.console[k](hash[k]);
    }

    this.console.info('timestamp', (new Date()).getTime());
    this.console.groupEnd();

    return true;
  }

  /**
   * Timer
   * @memberOf Logger.timer
   * @param {string} name
   * @param {boolean} start
   */
  timer(name, start) {
    const config = this.config,
        log = this.isLoggable();

    start = typeof start !== 'undefined';

    if (log && config.type.log) {
      start ? this.console.time(name) :
          this.console.timeEnd(name);
    }
  }

  /**
   * Define available logs
   * @memberOf Logger.defineLogs
   */
  defineLogs() {
    Object.keys((this.config || {}).type || {}).forEach(log => {
      log && (this[log] = this.puts.bind(this, log));
    });
  }
}
