#!/usr/bin/env node
"use strict";

var _argufy = _interopRequireDefault(require("argufy"));

var _util = require("util");

var _toc = _interopRequireDefault(require("./toc"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LOG = (0, _util.debuglog)('doc');
const DEBUG = /doc/.test(process.env.NODE_DEBUG);
const {
  toc,
  replace,
  out
} = (0, _argufy.default)({
  toc: 't',
  replace: {
    short: 'r',
    boolean: true
  },
  out: 'o'
}, process.argv);

(async () => {
  try {
    if (toc) await (0, _toc.default)(toc, out, replace);
  } catch ({
    stack,
    message
  }) {
    DEBUG ? LOG(stack) : console.log(message);
  }
})();
//# sourceMappingURL=index.js.map