"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = runJs;

var _fs = require("fs");

var _jsReplaceStream = _interopRequireDefault(require("../lib/js-replace-stream"));

var _catchment = _interopRequireDefault(require("catchment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Process a JavaScript file.
 * @param {string} source Path to the source JavaScript file.
 */
async function runJs(source, output) {
  const s = (0, _fs.createReadStream)(source);
  const rs = (0, _jsReplaceStream.default)();
  s.pipe(rs);
  const c = new _catchment.default({
    rs
  });
  const res = await c.promise;
  const ws = (0, _fs.createWriteStream)(output || source);
  await new Promise((r, j) => {
    ws.on('error', j).end(res, r);
  });
  console.log('Updated %s to include types.', source);
}
//# sourceMappingURL=run-js.js.map