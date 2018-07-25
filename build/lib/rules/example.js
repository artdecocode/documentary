"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.re = exports.replacer = void 0;

var _util = require("util");

var _path = require("path");

var _ = require("..");

const LOG = (0, _util.debuglog)('doc');

const replacer = async (match, source, from, to, type) => {
  try {
    let f = await (0, _.read)(source);
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
const re = /^%EXAMPLE: (.[^\n,]+)(?:, (.+?) => (.[^\s,]+))?(?:, (.+))?%$/gm;
exports.re = re;
const exampleRule = {
  re,
  replacement: replacer
};
var _default = exampleRule;
exports.default = _default;
//# sourceMappingURL=example.js.map