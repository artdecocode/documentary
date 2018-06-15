#!/usr/bin/env node
"use strict";

var _argufy = _interopRequireDefault(require("argufy"));

var _util = require("util");

var _run = _interopRequireDefault(require("./run"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LOG = (0, _util.debuglog)('doc');
const DEBUG = /doc/.test(process.env.NODE_DEBUG);
const {
  source,
  output,
  toc
} = (0, _argufy.default)({
  source: {
    command: true
  },
  toc: {
    short: 't',
    boolean: true
  },
  output: 'o'
}, process.argv);

(async () => {
  try {
    await (0, _run.default)(source, output, toc);
  } catch ({
    stack,
    message
  }) {
    DEBUG ? LOG(stack) : console.log(message);
  }
})();
//# sourceMappingURL=index.js.map