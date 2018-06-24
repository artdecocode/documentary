"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.gifRe = void 0;
// import { debuglog } from 'util'
// const LOG = debuglog('doc')
`%GIF path-to-file
alt
summary
%`;
const gifRe = /^%GIF (.+)\n(.+)\n(.+)\n%$/mg;
exports.gifRe = gifRe;
const gifRule = {
  re: gifRe,

  replacement(match, path, alt, summary) {
    const r = b(summary, alt, path);
    return r;
  }

};

const b = (summary, alt, gif) => {
  return `
<details>
  <summary>${summary}</summary>
  <table>
  <tr><td>
    <img alt="${alt}" src="${gif}" />
  </td></tr>
  </table>
</details>
`.trim();
};

var _default = gifRule;
exports.default = _default;
//# sourceMappingURL=gif.js.map