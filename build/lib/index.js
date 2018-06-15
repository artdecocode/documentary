"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.titleRule = exports.titleReplacer = exports.tableRule = exports.getLink = void 0;

var _util = require("util");

const LOG = (0, _util.debuglog)('doc');

const getLink = title => {
  const l = title.replace(/<br\/>/g, '').replace(/&nbsp;/g, '').replace(/[^\w-\d ]/g, '').toLowerCase().replace(/[, ]/g, '-');
  return l;
};

exports.getLink = getLink;

const tableRule = (match, table) => {
  const t = table.trim();

  try {
    const res = JSON.parse(t);
    const [header, ...rows] = res;
    const a = [getRow(header), getRow(header.map(({
      length
    }) => '-'.repeat(length))), ...rows.map(getRow)];
    return a.join('\n');
  } catch (err) {
    LOG('could not parse the table');
    return match;
  }
};

exports.tableRule = tableRule;

const getRow = row => {
  const s = `| ${row.join(' | ')} |`;
  return s;
};

const titleReplacer = (match, level, isAsync, method, returnType, title) => {
  const t = title.trim();
  const sig = `${level} ${isAsync ? '`async ' : '`'}${method}(`;
  const endSig = `): ${returnType ? returnType : 'void'}\``;
  const nl = '<br/>'; // '<br/>'

  const i = '&nbsp;&nbsp;'; // '&nbsp;

  const single = `${sig}${endSig}`;

  try {
    if (!t.trim()) return single;
    /** @type {[]} */

    const args = JSON.parse(t);
    if (!args.length) return single;
    const lines = args.map(([name, type]) => {
      if (typeof type == 'string') {
        return `\`${name}: ${type}\``;
      }

      const l = Object.keys(type).map(key => {
        // const isRequired = key.endsWith('?')
        const [propType, defaultValue] = type[key]; // static?: boolean = true,

        return `${key}: ${propType}${defaultValue ? ` = ${defaultValue}` : ''}`;
      }).map(line => `\`${line}\``).join(`,${nl}${i.repeat(2)}`);
      const n = `\`${name}: {\`${nl}${i.repeat(2)}${l}${nl}${i.repeat(1)}\`}\``;
      return n;
    });
    const nls = `${nl}${i.repeat(1)}`;
    const s = lines.join(`,${nls}`);
    const res = `${sig}\`${nls}${s}${nl}\`${endSig}`;
    return res;
  } catch (err) {
    LOG('could not parse the method title');
    return match;
  }
};

exports.titleReplacer = titleReplacer;
const titleRule = {
  re: /```(#+)( async)? (\w+)(?: => (.+)\n)?([\s\S]*?)```/g,
  replacement: titleReplacer
};
exports.titleRule = titleRule;
//# sourceMappingURL=index.js.map