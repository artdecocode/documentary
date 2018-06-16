"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.badgeRule = void 0;
const badgeRule = {
  re: /^%NPM: ([\w\d-_]+)%$/gm,

  replacement(match, name) {
    return `[![npm version](https://badge.fury.io/js/${name}.svg)](https://npmjs.org/package/${name})`;
  }

};
exports.badgeRule = badgeRule;
//# sourceMappingURL=rules.js.map