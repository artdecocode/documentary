"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.replacer = void 0;

var _util = require("util");

const LOG = (0, _util.debuglog)('doc');

const replacer = (match, table) => {
  const t = table.trim();

  try {
    const res = JSON.parse(t);
    const [header, ...rows] = res;
    const a = [getRow(header), getRow(header.map(({
      length
    }) => '-'.repeat(length))), ...rows.map(getRow)];
    return a.join('\n');
  } catch (err) {
    LOG('Could not parse the table.');
    return match;
  }
};

exports.replacer = replacer;

const getRow = row => {
  const s = `| ${row.join(' | ')} |`;
  return s;
};

const tableRule = {
  re: /```table([\s\S]+?)```/g,
  replacement: replacer
};
var _default = tableRule;
exports.default = _default;
//# sourceMappingURL=table.js.map