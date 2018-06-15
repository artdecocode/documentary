"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getToc = exports.default = void 0;

var _stream = require("stream");

var _catchment = _interopRequireDefault(require("catchment"));

var _fs = require("fs");

var _ = require(".");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const re = /(?:^|\n) *(#+) *((?:(?!\n)[\s\S])+)\n/;

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
    const rre = new RegExp(`(?:${re.source})|(?:${_.methodTitleRe.source})`, 'g');

    while ((res = rre.exec(buffer)) !== null) {
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
          const b = res.slice(4, 6).filter(a => a).join(' ').trim();
          const json = res[7] || '[]';
          const args = JSON.parse(json);
          const s = args.map(([name, type]) => {
            if (typeof type == 'string') return `${name}: ${type}`;
            return `${name}: object`;
          });
          const fullTitle = (0, _.replaceTitle)(...res.slice(3)).replace(/^#+ +/, '');
          link = (0, _.getLink)(fullTitle);
          t = `\`${b}(${s.join(', ')})${res[6] ? `: ${res[6]}` : ''}\``;
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

const getToc = async path => {
  const md = (0, _fs.createReadStream)(path);
  const rs = new Toc();
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
 * @typedef {Object} Config
 * @property {boolean} [skipLevelOne=true] Don't use the first title in the TOC (default `true`).
 */


exports.getToc = getToc;
//# sourceMappingURL=Toc.js.map