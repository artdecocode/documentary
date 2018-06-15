"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createReplaceStream;

var _restream = require("restream");

var _util = require("util");

var _ = require(".");

const LOG = (0, _util.debuglog)('doc');

function createReplaceStream(toc) {
  const s = (0, _restream.replaceStream)([{
    re: /<!--[\s\S]*?-->\n*/g,

    replacement() {
      LOG('stripping comment');
      return '';
    }

  }, {
    re: /^%TOC%$/gm,
    replacement: toc
  }, {
    re: /```table([\s\S]+?)```/g,
    replacement: _.tableRule
  }, _.titleRule]);
  return s;
}
//# sourceMappingURL=replace-stream.js.map