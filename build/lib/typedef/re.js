"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const propRe = / \* @prop(?:erty)? .+\n/;
const typedefRe = new RegExp(`^ \\* @typedef {(.+?)} (.+?)(?: (.+))?\\n((?:${propRe.source})*)`, 'gm');
var _default = typedefRe;
exports.default = _default;
//# sourceMappingURL=re.js.map