"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.badgeRe = void 0;
const badgeRe = /^%NPM: ((?:[@\w\d-_]+\/)?[\w\d-_]+)%$/gm;
exports.badgeRe = badgeRe;
const badgeRule = {
  re: badgeRe,

  replacement(match, name) {
    const n = encodeURIComponent(name);
    return `[![npm version](https://badge.fury.io/js/${n}.svg)](https://npmjs.org/package/${name})`;
  }

};
var _default = badgeRule;
exports.default = _default;
//# sourceMappingURL=badge.js.map