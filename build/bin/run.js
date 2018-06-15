"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = run;

var _Toc = _interopRequireDefault(require("../lib/Toc"));

var _util = require("util");

var _catchment = _interopRequireDefault(require("catchment"));

var _fs = require("fs");

var _replaceStream = _interopRequireDefault(require("../lib/replace-stream"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LOG = (0, _util.debuglog)('doc');

const replaceFile = (path, toc, out) => {
  const rs = (0, _fs.createReadStream)(path);
  const s = (0, _replaceStream.default)(toc);
  const ws = out ? (0, _fs.createWriteStream)(out) : process.stdout;
  rs.pipe(s).pipe(ws);

  if (out) {
    ws.on('close', () => {
      console.log('Saved %s from %s', out, path);
    });
  }
};

const getToc = async path => {
  const md = (0, _fs.createReadStream)(path);
  const rs = new _Toc.default();
  md.pipe(rs);
  const {
    promise
  } = new _catchment.default({
    rs
  });
  const t = await promise;
  return t.trim();
};
/**
 * @param {string} path
 * @param {string} [out]
 * @param {string} [out]
 * @param {boolean} [toc]
 */


async function run(path, out, toc) {
  LOG('reading %s', path);
  const t = await getToc(path);

  if (toc) {
    console.log(t);
    process.exit();
  }

  replaceFile(path, t, out);
}
//# sourceMappingURL=run.js.map