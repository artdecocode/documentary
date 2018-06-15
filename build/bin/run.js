"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = run;

var _Toc = _interopRequireWildcard(require("../lib/Toc"));

var _util = require("util");

var _fs = require("fs");

var _catchment = _interopRequireDefault(require("catchment"));

var _replaceStream = _interopRequireDefault(require("../lib/replace-stream"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const LOG = (0, _util.debuglog)('doc');

const replaceFile = async (path, out) => {
  const rs = (0, _fs.createReadStream)(path);
  const s = (0, _replaceStream.default)();
  const toc = new _Toc.default();
  const {
    promise: tocPromise
  } = new _catchment.default({
    rs: toc
  });
  const {
    promise
  } = new _catchment.default({
    rs: s
  });
  rs.pipe(s).pipe(toc);
  const t = await tocPromise;
  const res = await promise;
  const realRes = res.replace(/^%TOC%$/gm, t.trim());

  if (out) {
    const ws = (0, _fs.createWriteStream)(out);
    ws.end(realRes);
    ws.on('close', () => {
      console.log('Saved %s from %s', out, path);
    });
  } else {
    console.log(realRes);
  }
};
/**
 * @param {string} path
 * @param {string} [out]
 * @param {string} [out]
 * @param {boolean} [toc]
 */


async function run(path, out, toc) {
  LOG('reading %s', path);

  if (toc) {
    const t = await (0, _Toc.getToc)(path);
    console.log(t);
    process.exit();
  }

  await replaceFile(path, out);
}
//# sourceMappingURL=run.js.map