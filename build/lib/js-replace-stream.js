"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createJsReplaceStream;

var _restream = require("restream");

var _typedefJs = _interopRequireDefault(require("./rules/typedef-js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createJsReplaceStream() {
  const s = new _restream.Replaceable([_typedefJs.default]);
  return s;
}
//# sourceMappingURL=js-replace-stream.js.map