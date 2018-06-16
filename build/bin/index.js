#!/usr/bin/env node
"use strict";

var _fs = require("fs");

var _argufy = _interopRequireDefault(require("argufy"));

var _wrote = require("wrote");

var _util = require("util");

var _run = _interopRequireDefault(require("./run"));

var _dirStream = _interopRequireDefault(require("../lib/dir-stream"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import runFile from './file'
// import runDir from './dir'
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

const doc = async (source, output, toc) => {
  if (!source) {
    console.log('Please specify an input file.'); // print usage

    process.exit(1);
  }

  let stream;

  try {
    const {
      content
    } = await (0, _wrote.readDirStructure)(source);
    stream = (0, _dirStream.default)(source, content);
  } catch (err) {
    const {
      code
    } = err;

    if (code == 'ENOTDIR') {
      stream = (0, _fs.createReadStream)(source);
    } else {
      throw err;
    }
  }

  await (0, _run.default)(stream, output, toc);
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
      console.log('File %s does not exist', _source);
      process.exit(2);
    }

    DEBUG ? LOG(stack) : console.log(message);
  } // if (watch) {
  //   watchFile(source, async () => {
  //     await doRun()
  //   })
  // }

})();
//# sourceMappingURL=index.js.map