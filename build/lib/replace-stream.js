"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createReplaceStream;

var _restream = require("restream");

var _util = require("util");

const LOG = (0, _util.debuglog)('doc');
/**
 *
 * @param {string} [toc] The table of contents.
 */

function createReplaceStream(toc = '') {
  const s = (0, _restream.replaceStream)([{
    re: /^%TOC%$/gm,
    replacement: toc
  }, {
    re: /<!--[\s\S]*?-->\n*/g,

    replacement() {
      LOG('stripping comment');
      return '';
    }

  }, {
    re: /```table([\s\S]+?)```/g,

    replacement(match, table) {
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
    }

  }]);
  return s;
}

const getRow = row => {
  const s = `| ${row.join(' | ')} |`;
  return s;
};
//# sourceMappingURL=replace-stream.js.map