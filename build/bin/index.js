#!/usr/bin/env node
"use strict";

var _fs = require("fs");

var _util = require("util");

var _run = _interopRequireDefault(require("./run"));

var _getArgs = _interopRequireDefault(require("./get-args"));

var _generate2 = _interopRequireDefault(require("./run/generate"));

var _extract2 = _interopRequireDefault(require("./run/extract"));

var _package = require("../../package.json");

var _catcher = _interopRequireDefault(require("./catcher"));

var _lib = require("../lib");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LOG = (0, _util.debuglog)('doc');
const DEBUG = /doc/.test(process.env.NODE_DEBUG);
const {
  source: _source,
  output: _output,
  toc: _toc,
  watch: _watch,
  push: _push,
  version: _version,
  extract: _extract
} = (0, _getArgs.default)();
let {
  generate: _generate,
  _argv
} = (0, _getArgs.default)();

if (_version) {
  console.log(_package.version);
  process.exit(0);
}

if (process.argv.find(a => a == '-p') && !_push) {
  (0, _catcher.default)('Please specify a commit message.');
}

if (process.argv.find(a => a == '-e') && !_extract) {
  (0, _catcher.default)('Please specify where to extract typedefs (- for stdout).');
}

if (_argv.find(g => g == '-g') && !_generate) {
  _generate = _source;
}

if (_source) {
  try {
    (0, _fs.lstatSync)(_source);
  } catch (err) {
    if (err.message) err.message = `Could not read input ${_source}: ${err.message}`;
    (0, _catcher.default)(err);
  }
}

const doc = async (source, output, justToc = false) => {
  if (!source) {
    throw new Error('Please specify an input file.');
  }

  const stream = (0, _lib.getStream)(source);
  await (0, _run.default)(stream, output, justToc);
};

(async () => {
  if (_extract) {
    await (0, _extract2.default)({
      source: _source,
      destination: _extract
    });
    return;
  }

  if (_generate) {
    await (0, _generate2.default)({
      source: _source,
      destination: _generate
    });
    return;
  }

  try {
    await doc(_source, _output, _toc);
  } catch ({
    stack,
    message,
    code
  }) {
    DEBUG ? LOG(stack) : console.log(message);
  }

  let debounce = false;

  if (_watch || _push) {
    // also watch referenced example files.
    (0, _fs.watch)(_source, {
      recursive: true
    }, async () => {
      if (!debounce) {
        debounce = true;
        await doc(_source, _output, _toc);

        if (_push) {
          console.log('Pushing documentation changes.');
          await (0, _lib.gitPush)(_source, _output, _push);
        }

        debounce = false;
      }
    });
  }
})();
//# sourceMappingURL=index.js.map