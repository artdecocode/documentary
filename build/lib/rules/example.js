"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.re = exports.replacer = void 0;

var _util = require("util");

var _path = require("path");

var _fs = require("fs");

var _catchment = _interopRequireDefault(require("catchment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LOG = (0, _util.debuglog)('doc');

const read = async source => {
  const rs = (0, _fs.createReadStream)(source);
  const data = await new Promise(async (r, j) => {
    const {
      promise
    } = new _catchment.default({
      rs
    });
    rs.on('error', j);
    const res = await promise;
    r(res);
  });
  return data;
};

const replacer = async (match, source, from, to, type) => {
  try {
    let f = await read(source);
    f = f.trim();

    if (from && to) {
      f = f.replace(/^import .+? from ['"](.+)['"]$/mg, (m, fr) => {
        if (fr == from) return m.replace(fr, to);
        return m;
      });
    }

    return `\`\`\`${type || (0, _path.parse)(source).ext.replace(/^\./, '')}
${f.trim()}
\`\`\``;
  } catch (err) {
    LOG(err);
    return match;
  }
};

exports.replacer = replacer;
const re = /^%EXAMPLE: (.[^,]+)(?:, (.+?) => (.[^,]+))?(?:, (.+))?%$/gm;
exports.re = re;
const exampleRule = {
  re,
  replacement: replacer
};
var _default = exampleRule;
exports.default = _default;
//# sourceMappingURL=example.js.map