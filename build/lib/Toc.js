"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ = require(".");

var _stream = require("stream");

const re = /^ *(#+) *((?:(?!\n)[\s\S])+)\n/gm;

class Toc extends _stream.Transform {
  /**
   * @param {Object} config
   * @param {boolean} [config.skipLevelOne=true]
   */
  constructor({
    skipLevelOne = true
  } = {}) {
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
//# sourceMappingURL=Toc.js.map