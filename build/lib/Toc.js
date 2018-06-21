"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getToc = exports.default = void 0;

var _stream = require("stream");

var _catchment = _interopRequireDefault(require("catchment"));

var _ = require(".");

var _methodTitle = require("./rules/method-title");

var _rules = require("./rules");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const re = /(?:^|\n) *(#+) *((?:(?!\n)[\s\S])+)\n/;
const rre = (0, _.makeARegexFromRule)({
  re
});

class Toc extends _stream.Transform {
  /**
   * A transform stream which will extract the titles in the markdown document and transform them into a markdown nested list with links.
   * @param {Config} [config] Configuration object.
   * @param {boolean} [config.skipLevelOne=true] Don't use the first title in the TOC (default `true`).
   */
  constructor(config = {}) {
    const {
      skipLevelOne = true
    } = config;
    super();
    this.skipLevelOne = skipLevelOne;
  }

  _transform(buffer, enc, next) {
    let res;
    const b = `${buffer}`.replace(new RegExp(_rules.commentRe, 'g'), '').replace(new RegExp(_rules.codeRe, 'g'), match => {
      if (_.exactMethodTitle.test(match) || rre.test(match)) {
        return match;
      }

      return ''; // ignore code blocks
    });
    const superRe = new RegExp(`(?:${re.source})|(?:${_methodTitle.methodTitleRe.source})`, 'g');

    while ((res = superRe.exec(b)) !== null) {
      let t;
      let level;
      let link;

      if (res[1]) {
        // normal title regex
        const [, {
          length
        }, title] = res;
        level = length;
        if (this.skipLevelOne && level == 1) continue;
        t = title;
        link = (0, _.getLink)(title);
      } else {
        // the method title regex
        try {
          const l = res[3];
          level = l.length;
          const bb = res.slice(4, 6).filter(a => a).join(' ').trim();
          const json = res[7] || '[]';
          const args = JSON.parse(json);
          const s = args.map(([name, type]) => {
            if (typeof type == 'string') return `${name}: ${type}`;
            return `${name}: object`;
          });
          const fullTitle = (0, _methodTitle.replaceTitle)(...res.slice(3)).replace(/^#+ +/, '');
          link = (0, _.getLink)(fullTitle);
          t = `\`${bb}(${s.join(', ')})${res[6] ? `: ${res[6]}` : ''}\``;
        } catch (err) {
          // ok
          continue;
        }
      }

      const heading = `[${t}](#${link})`;
      let s;

      if (level == 2) {
        s = `- ${heading}`;
      } else {
        const p = '  '.repeat(level - 2);
        s = `${p}* ${heading}`;
      }

      this.push(s);
      this.push('\n');
    }

    re.lastIndex = -1;
    next();
  }

}

exports.default = Toc;

const getToc = async stream => {
  const rs = new Toc();
  stream.pipe(rs);
  const {
    promise
  } = new _catchment.default({
    rs
  });
  const t = await promise;
  return t.trim();
};
/**
 * @typedef {Object} Config
 * @property {boolean} [skipLevelOne=true] Don't use the first title in the TOC (default `true`).
 */


exports.getToc = getToc;
//# sourceMappingURL=Toc.js.map