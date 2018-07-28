"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = require("fs");

var _util = require("util");

var _jsReplaceStream = _interopRequireDefault(require("../../lib/js-replace-stream"));

var _catcher = _interopRequireDefault(require("../catcher"));

var _whichStream = _interopRequireDefault(require("./which-stream"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LOG = (0, _util.debuglog)('doc');
/**
 * Process a JavaScript file to include `@typedef`s found with the `/* documentary types.xml *\/` marker.
 * @param {Config} config Configuration Object.
 * @param {string} config.source Path to the source JavaScript file.
 * @param {string} [config.destination] Path to the source JavaScript file. If not specified, source is assumed (overwriting the original file).
 * @param {string} [config.stream] An output stream to which to write instead of a location from `generateTo`.
 */

async function generateTypedef(config) {
  const {
    source,
    destination = source,
    stream
  } = config;

  try {
    if (!source && !stream) {
      console.log('Please specify a JavaScript file or a pass a stream.');
      process.exit(1);
    }

    const s = (0, _fs.createReadStream)(source);
    const readable = (0, _jsReplaceStream.default)();
    s.pipe(readable);
    const p = (0, _whichStream.default)({
      source,
      stream,
      readable,
      destination
    });
    await new Promise((r, j) => {
      readable.on('error', e => {
        LOG('Error in Replaceable');
        j(e);
      });
      s.on('error', e => {
        LOG('Error in Read');
        j(e);
      });
      readable.on('end', r);
    });
    await p;

    if (stream) {
      LOG('%s written to stream', source);
    } else if (source == destination) {
      console.error('Updated %s to include types.', source);
    } else if (destination == '-') {
      console.error('Written %s to stdout.', source);
    } else {
      console.error('Saved output to %s', destination);
    }
  } catch (err) {
    (0, _catcher.default)(err);
  }
}
/**
 * @typedef {Object} Config
 * @prop {string} source Path to the source JavaScript file.
 * @prop {string} [output] Path to the source JavaScript file.
 */


var _default = generateTypedef;
exports.default = _default;
//# sourceMappingURL=generate.js.map