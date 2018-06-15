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

const re = /^ *(#+) *((?:(?!\n)[\s\S])+)\n/gm;

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

    while ((res = re.exec(buffer)) !== null) {
      const [, {
        length: level
      }, title] = res;
      if (this.skipLevelOne && level == 1) continue;
      const link = (0, _.getLink)(title);
      const t = `[${title}](#${link})`;
      let s;

      if (level == 2) {
        s = `- ${t}`;
      } else {
        const p = '  '.repeat(level - 2);
        s = `${p}* ${t}`;
      }

      this.push(s);
      this.push('\n');
    }

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