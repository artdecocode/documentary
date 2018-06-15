#!/usr/bin/env node
"use strict";

var _fs = require("fs");

var _argufy = _interopRequireDefault(require("argufy"));

var _util = require("util");

var _run = _interopRequireDefault(require("./run"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LOG = (0, _util.debuglog)('doc');
const DEBUG = /doc/.test(process.env.NODE_DEBUG);
const {
  source,
  output,
  toc,
  watch
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
}, process.argv);

const doRun = async () => {
  try {
    await (0, _run.default)(source, output, toc);
  } catch ({
    stack,
    message
  }) {
    DEBUG ? LOG(stack) : console.log(message);
  }
};

(async () => {
  if (!source) {
    console.log('Please specify an input file.'); // print usage

    process.exit(1);
  }

  await doRun();

  if (watch) {
    (0, _fs.watchFile)(source, async () => {
      await doRun();
    });
  }
})();
//# sourceMappingURL=index.js.map