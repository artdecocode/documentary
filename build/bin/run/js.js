"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = require("fs");

var _catchment = _interopRequireDefault(require("catchment"));

var _jsReplaceStream = _interopRequireDefault(require("../../lib/js-replace-stream"));

var _catcher = _interopRequireDefault(require("../catcher"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Process a JavaScript file to include `@typedef`s found with the `/* documentary types.xml *\/` marker.
 * @param {Config} config Configuration Object.
 * @param {string} config.source Path to the source JavaScript file.
 * @param {string} [config.output] Path to the source JavaScript file.
 */
async function runJs(config) {
  const {
    source,
    output = source
  } = config;

  try {
    if (!source) {
      console.log('Please specify a JavaScript file.');
      process.exit(1);
    }

    const s = (0, _fs.createReadStream)(source);
    const rs = (0, _jsReplaceStream.default)();
    s.pipe(rs);
    const c = new _catchment.default({
      rs
    });
    const res = await c.promise;
    const ws = (0, _fs.createWriteStream)(output);
    await new Promise((r, j) => {
      ws.on('error', j).end(res, r);
    });
    console.log(...(source == output ? ['Updated %s to include types.', source] : ['Saved output to %s', output]));
  } catch (err) {
    (0, _catcher.default)(err);
  }
}
/**
 * @typedef {Object} Config
 * @prop {string} source Path to the source JavaScript file.
 * @prop {string} [output] Path to the source JavaScript file.
 */


var _default = runJs;
exports.default = _default;
//# sourceMappingURL=js.js.map