"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.extractTag = exports.typeRe = void 0;

var _util = require("util");

const LOG = (0, _util.debuglog)('doc');
const typeRe = /^%TYPE( .+)?\n([\s\S]+?)\n%$/mg;
exports.typeRe = typeRe;

const execRes = (re, s) => {
  const res = re.exec(s);
  if (!res) return res;
  const [, ...args] = res;
  return args;
};

const extractProps = s => {
  const propsRe = /(\w+)="(.*?)"/g;
  let t;
  const r = [];

  while ((t = propsRe.exec(s)) !== null) {
    const [, key, value] = t;
    r.push({
      key,
      value: getPropValue(value)
    });
  }

  const tt = s.replace(propsRe, '').trim().split(' ').filter(a => a).reduce((a, k) => ({ ...a,
    [k]: true
  }), {});
  return r.reduce((acc, {
    key,
    value
  }) => ({ ...acc,
    [key]: value
  }), tt);
};

const getPropValue = val => {
  if (val == 'true') return true;
  if (val == 'false') return false;

  if (/^\d+$/.test(val)) {
    return parseInt(val, 10);
  }

  return val;
};

const extractTag = (tag, string) => {
  const re = new RegExp(`<${tag}( .[^>]+)?(?: /)?>(?:([\\s\\S]+?)</${tag}>)?`, 'g');
  const r = [];
  let t;

  while ((t = execRes(re, string)) !== null) {
    if (!t.length) continue;
    const [_p = '', _c = ''] = t;

    const p = _p.replace(/\/$/, '').trim();

    const props = extractProps(p);
    const item = {
      props,
      content: _c
    };
    r.push(item);
  }

  return r;
};

exports.extractTag = extractTag;

const tag = (t, s) => `<${t}>${s}</${t}>`;

const strong = s => tag('strong', s);

const getDescAndExample = (description, example, isExampleRow, hasExamples) => {
  const span2 = hasExamples ? ' colspan="2"' : '';

  if (!example) {
    return `<td${span2}>${description}</td>`;
  }

  if (isExampleRow) {
    return `<td${span2}>${description}</td>
  </tr>
  <tr></tr>
  <tr>
   <td colspan="${hasExamples ? 4 : 3}">${example}</td>`;
  }

  return `<td>${description}</td>
   <td>${example}</td>`;
};

const makeTable = (properties, tocTitles) => {
  const hasExamples = properties.some(({
    example,
    isExampleRow
  }) => example && !isExampleRow);
  const rows = properties.map(({
    name,
    type,
    required,
    description = '',
    example = '',
    isExampleRow
  }) => {
    const t = `<code>${name}</code>`;
    const n = required ? strong(t) : t;
    const nn = tocTitles ? `[${n}](t)` : n;
    const e = example.startsWith('```') ? `\n\n${example}` : example;
    return `  <tr>
   <td>${nn}</td>
   <td>${tag('em', type)}</td>
   ${getDescAndExample(description, e, isExampleRow, hasExamples)}
  </tr>`;
  });
  return `<table>
 <thead>
  <tr>
   <th>Property</th>
   <th>Type</th>
   <th>Description</th>${hasExamples ? '\n   <th>Example</th>' : ''}
  </tr>
 </thead>
 <tbody>
${rows.join('\n')}
 </tbody>
</table>
`;
};

const typeRule = {
  re: typeRe,

  replacement(match, tocTitles, body) {
    try {
      const tags = extractTag('p', body).map(({
        content,
        props
      }) => {
        const [{
          content: description
        } = {}] = extractTag('d', content);
        const [{
          content: example,
          props: {
            row: isExampleRow = false
          } = {}
        } = {}] = extractTag('e', content);
        return {
          description,
          example,
          isExampleRow,
          ...props
        };
      });
      const table = makeTable(tags, tocTitles);
      return table;
    } catch (err) {
      LOG('Could not parse type, %s', err.message);
      return match;
    }
  }

}; // const b = (summary, alt, gif) => {
//   return `
// <details>
//   <summary>${summary}</summary>
//   <table>
//   <tr><td>
//     <img alt="${alt}" src="${gif}" />
//   </td></tr>
//   </table>
// </details>
// `.trim()
// }

var _default = typeRule;
exports.default = _default;
//# sourceMappingURL=type.js.map