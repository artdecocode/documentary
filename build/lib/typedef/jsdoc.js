"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.jsDocRe = void 0;

var _util = require("util");

const jsDocRe = / \* @param {(.+?)} (\[)?([^\s\]]+)\]?(?: .+)?((?:\n \* @param {(?:.+?)} \[?\3\]?.*)*)/gm;
exports.jsDocRe = jsDocRe;
const LOG = (0, _util.debuglog)('doc');
const JSDocRule = {
  re: jsDocRe,

  replacement(match, typeName, optional, paramName) {
    if (!(typeName in this.types)) {
      LOG('Type %s not found', typeName);
      return match;
    }
    /** @type {Type} */


    const t = this.types[typeName];
    const s = t.toParam(paramName, optional);
    return s;
  }

};
/**
 * @typedef {import('./Type').default} Type
 */

var _default = JSDocRule;
exports.default = _default;
//# sourceMappingURL=jsdoc.js.map