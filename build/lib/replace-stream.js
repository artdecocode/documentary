"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createReplaceStream;

var _restream = require("restream");

var _rules = require("./rules");

var _table = _interopRequireDefault(require("./rules/table"));

var _methodTitle = _interopRequireDefault(require("./rules/method-title"));

var _example = _interopRequireDefault(require("./rules/example"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createReplaceStream(toc) {
  const tocRule = (0, _rules.createTocRule)(toc);
  const s = new _restream.Replaceable([_rules.commentRule, tocRule, _rules.badgeRule, _table.default, _methodTitle.default, _example.default]);
  return s;
}
//# sourceMappingURL=replace-stream.js.map