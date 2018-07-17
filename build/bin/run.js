"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = run;

var _Toc = require("../lib/Toc");

var _fs = require("fs");

var _replaceStream = _interopRequireDefault(require("../lib/replace-stream"));

var _stream = require("stream");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const replaceFile = async (stream, toc, out) => {
  await new Promise((r, j) => {
    const s = (0, _replaceStream.default)(toc);
    const ws = out ? (0, _fs.createWriteStream)(out) : process.stdout;
    stream.pipe(s).pipe(ws);

    if (out) {
      ws.on('close', () => {
        console.log('Saved %s', out);
        r();
      });
      ws.on('error', j);
    } else {
      r();
    }
  });
};
/**
 * @param {Readable} stream A readable stream.
 * @param {string} [out] Path to the output file.
 * @param {boolean} [justToc] Just print the TOC.
 */


async function run(stream, out, justToc) {
  const pt = new _stream.PassThrough();
  pt.pause();
  stream.pipe(pt);
  const t = await (0, _Toc.getToc)(stream);

  if (justToc) {
    console.log(t);
    process.exit();
  }

  pt.resume();
  await replaceFile(pt, t, out);
}
//# sourceMappingURL=run.js.map