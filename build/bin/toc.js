"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Toc = _interopRequireDefault(require("../lib/Toc"));

var _util = require("util");

var _catchment = _interopRequireDefault(require("catchment"));

var _restream = require("restream");

var _fs = require("fs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LOG = (0, _util.debuglog)('doc');

const replaceFile = (path, re, replacement, outfile) => {
  const rs = (0, _fs.createReadStream)(path);
  const s = (0, _restream.replaceStream)([{
    re,
    replacement
  }, {
    re: /<!--[\s\S]*?-->\n+/g,
    replacement: ''
  }]);
  const ws = outfile ? (0, _fs.createWriteStream)(outfile) : process.stdout;
  rs.pipe(s).pipe(ws);

  if (outfile) {
    ws.on('close', () => {
      console.log('Saved %s from %s', outfile, path);
    });
  }
};

const runToc = async (path, out, replace) => {
  LOG('reading %s', path);
  const md = (0, _fs.createReadStream)(path);
  const rs = new _Toc.default();
  md.pipe(rs);

  if (replace) {
    const {
      promise
    } = new _catchment.default({
      rs
    });
    const t = await promise;
    replaceFile(path, /^%TOC%$/gm, t.trim(), out);
  } else {
    rs.pipe(process.stdout);
  }
};

var _default = runToc;
exports.default = _default;
//# sourceMappingURL=toc.js.map