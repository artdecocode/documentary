"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createReplaceStream;

var _restream = require("restream");

var _rules = require("./rules");

var _lib = require("../lib");

var _table = _interopRequireDefault(require("./rules/table"));

var _methodTitle = _interopRequireDefault(require("./rules/method-title"));

var _example = _interopRequireDefault(require("./rules/example"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createReplaceStream(toc) {
  const tocRule = (0, _rules.createTocRule)(toc);
  const codeBlocks = [];
  const marker = `%%_DOCUMENTARY_REPLACEMENT_${Date.now()}_%%`;
  const s = new _restream.Replaceable([_rules.commentRule, {
    re: new RegExp(_rules.codeRe, 'g'),

    replacement(match) {
      if (_lib.exactTable.test(match) || _lib.exactMethodTitle.test(match)) {
        return match;
      }

      codeBlocks.push(match);
      return marker;
    }

  }, tocRule, _rules.badgeRule, _table.default, _methodTitle.default, _example.default, {
    re: new RegExp(marker, 'g'),

    replacement() {
      return codeBlocks.shift();
    }

  }]);
  return s;
}
//# sourceMappingURL=replace-stream.js.map