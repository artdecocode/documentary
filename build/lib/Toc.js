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

var _restream = require("restream");

var _markers = require("./markers");

var _table = require("./rules/table");

var _type = _interopRequireDefault(require("./rules/type"));

var _typedefMd = _interopRequireDefault(require("./rules/typedef-md"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const re = /(?:^|\n) *(#+) *((?:(?!\n)[\s\S])+)\n/;

const getBuffer = async buffer => {
  const {
    title,
    methodTitle,
    code,
    innerCode,
    table,
    linkTitle
  } = (0, _markers.makeMarkers)({
    title: /^ *#+.+/gm,
    methodTitle: _methodTitle.methodTitleRe,
    code: _rules.codeRe,
    innerCode: _rules.innerCodeRe,
    table: _table.tableRe,
    linkTitle: _rules.linkTitleRe
  });
  const [cutTitle, cutLinkTitle, cutCode, cutMethodTitle, cutInnerCode, cutTable] = [title, linkTitle, code, methodTitle, innerCode, table].map(marker => {
    const rule = (0, _markers.makeInitialRule)(marker);
    return rule;
  });
  const [insertTitle, insertLinkTitle, insertMethodTitle, insertInnerCode, insertTable] = [title, linkTitle, methodTitle, innerCode, table].map(marker => {
    const rule = (0, _markers.makeRule)(marker);
    return rule;
  });
  const rs = new _restream.Replaceable([cutTitle, cutInnerCode, cutLinkTitle, {
    re: innerCode.regExp,

    replacement() {
      return '';
    }

  }, cutTable, cutMethodTitle, cutCode, _rules.commentRule, _typedefMd.default, _type.default, insertMethodTitle, insertTable, insertLinkTitle, insertInnerCode, insertTitle]);
  const c = new _catchment.default({
    rs
  });
  rs.end(buffer);
  const b = await c.promise;
  return b;
};

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
    this.level = 0;
  }

  async _transform(buffer, enc, next) {
    let res;
    const b = await getBuffer(buffer); // create a single regex otherwise titles will always come before method titles

    const superRe = new RegExp(`(?:${re.source})|(?:${_methodTitle.methodTitleRe.source})|(?:${_rules.linkTitleRe.source})`, 'g');

    while ((res = superRe.exec(b)) !== null) {
      let t;
      let level;
      let link;

      if (res[8] && res[9]) {
        t = res[8];
        level = res[9] != 't' ? res[9].length : this.level + 1;
        link = (0, _.getLink)(t);
      } else if (res[1]) {
        // normal title regex
        const [, {
          length
        }, title] = res;
        this.level = length;
        if (this.skipLevelOne && this.level == 1) continue;
        t = title;
        link = (0, _.getLink)(title);
      } else {
        // the method title regex
        try {
          const {
            length
          } = res[3];
          this.level = length;
          if (this.skipLevelOne && this.level == 1) continue;
          const bb = res.slice(4, 6).filter(a => a).join(' ').trim();
          const json = res[7] || '[]';
          const args = JSON.parse(json);
          const s = args.map(([name, type, shortType]) => {
            let tt;
            if (shortType) tt = shortType;else if (typeof type == 'string') tt = type;else tt = 'object';
            return `${name}: ${tt}`;
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
      if (!level) level = this.level;
      level = this.skipLevelOne ? level - 1 : level;

      if (level == 1) {
        s = `- ${heading}`;
      } else {
        const p = '  '.repeat(Math.max(level - 1, 0));
        s = `${p}* ${heading}`;
      }

      this.push(s);
      this.push('\n');
    }

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