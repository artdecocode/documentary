"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.methodTitleRe = exports.replacer = exports.replaceTitle = void 0;

var _util = require("util");

const LOG = (0, _util.debuglog)('doc');

const replaceTitle = (level, isAsync, method, returnType, title) => {
  const t = title.trim();
  const sig = `${level} ${isAsync ? '`async ' : '`'}${method}(`;
  const endSig = `): ${returnType ? returnType : 'void'}\``;
  const nl = '<br/>';
  const i = '&nbsp;&nbsp;';
  const single = `${sig}${endSig}`;
  if (!t.trim()) return single;
  /** @type {[]} */

  const args = JSON.parse(t);
  if (!args.length) return single;
  const lines = args.map(([name, type]) => {
    if (typeof type == 'string') {
      return `\`${name}: ${type},\``;
    }

    const l = Object.keys(type).map(key => {
      // const isRequired = key.endsWith('?')
      const [propType, defaultValue] = type[key]; // static?: boolean = true,

      return `${key}: ${propType}${defaultValue ? ` = ${defaultValue}` : ''}`;
    }).map(line => `\`${line},\``).join(`${nl}${i.repeat(2)}`);
    const n = `\`${name}: {\`${nl}${i.repeat(2)}${l}${nl}${i.repeat(1)}\`},\``;
    return n;
  });
  const nls = `${nl}${i.repeat(1)}`;
  const s = lines.join(nls);
  const res = `${sig}\`${nls}${s}${nl}\`${endSig}`;
  return res;
};

exports.replaceTitle = replaceTitle;
const re = /```(#+)( async)? (\w+)(?: => (.+)\n)?([\s\S]*?)```/g;
exports.methodTitleRe = re;

const replacer = (match, level, isAsync, method, returnType, title) => {
  try {
    const res = replaceTitle(level, isAsync, method, returnType, title);
    return res;
  } catch (err) {
    LOG('could not parse the method title');
    return match;
  }
};

exports.replacer = replacer;
const titleRule = {
  re,
  replacement: replacer
};
var _default = titleRule;
exports.default = _default;
//# sourceMappingURL=method-title.js.map