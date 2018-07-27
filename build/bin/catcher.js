"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = require("util");

const LOG = (0, _util.debuglog)('doc');
const DEBUG = /doc/.test(process.env.NODE_DEBUG);

const catcher = async err => {
  let stack;
  let message;

  if (err instanceof Error) {
    ({
      stack,
      message
    } = err);
  } else {
    stack = message = err;
  }

  DEBUG ? LOG(stack) : console.log(message);
  process.exit(1);
};

var _default = catcher;
exports.default = _default;
//# sourceMappingURL=catcher.js.map