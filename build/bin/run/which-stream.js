"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _catchment = _interopRequireDefault(require("catchment"));

var _fs = require("fs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function whichStream({
  source,
  readable,
  stream,
  destination
}) {
  if (stream) {
    readable.pipe(stream); // push to stream

    await new Promise((r, j) => {
      stream.once('error', j).once('end', r);
    });
  } else if (destination == '-') {
    // printing to stdout
    readable.pipe(process.stdout);
  } else if (source == destination) {
    // overwriting file
    const {
      promise
    } = new _catchment.default({
      rs: readable
    });
    const res = await promise;
    const ws = (0, _fs.createWriteStream)(destination);
    await new Promise((r, j) => {
      ws.once('error', j).end(res, r);
    });
  } else {
    const ws = (0, _fs.createWriteStream)(destination);
    readable.pipe(ws);
    await new Promise((r, j) => {
      ws.on('error', j).on('close', r);
    });
  }
}

var _default = whichStream;
exports.default = _default;
//# sourceMappingURL=which-stream.js.map