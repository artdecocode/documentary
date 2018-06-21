#!/usr/bin/env node
"use strict";

var _fs = require("fs");

var _argufy = _interopRequireDefault(require("argufy"));

var _pedantry = _interopRequireDefault(require("pedantry"));

var _util = require("util");

var _run = _interopRequireDefault(require("./run"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LOG = (0, _util.debuglog)('doc');
const DEBUG = /doc/.test(process.env.NODE_DEBUG);
const {
  source: _source,
  output: _output,
  toc: _toc,
  watch: _watch
} = (0, _argufy.default)({
  source: {
    command: true
  },
  toc: {
    short: 't',
    boolean: true
  },
  watch: {
    short: 'w',
    boolean: true
  },
  output: 'o'
});

const doc = async (source, output, justToc = false) => {
  if (!source) {
    console.log('Please specify an input file.'); // print usage

    process.exit(1);
  }

  const ls = (0, _fs.lstatSync)(source);
  let stream;

  if (ls.isDirectory()) {
    stream = new _pedantry.default(source);
  } else if (ls.isFile()) {
    stream = (0, _fs.createReadStream)(source);
  }

  await (0, _run.default)(stream, output, justToc);
};

(async () => {
  try {
    await doc(_source, _output, _toc);
  } catch ({
    stack,
    message,
    code
  }) {
    if (code == 'ENOENT') {
      console.log('File %s does not exist.', _source);
      process.exit(2);
    }

    DEBUG ? LOG(stack) : console.log(message);
  }

  if (_watch) {
    (0, _fs.watch)(_source, async () => {
      await doc(_source, _output, _toc);
    });
  }
})();
//# sourceMappingURL=index.js.map