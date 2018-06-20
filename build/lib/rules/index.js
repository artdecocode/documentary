"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.commentRule = exports.createTocRule = exports.badgeRule = void 0;

var _util = require("util");

const LOG = (0, _util.debuglog)('doc');
const badgeRule = {
  re: /^%NPM: ([\w\d-_]+)%$/gm,

  replacement(match, name) {
    return `[![npm version](https://badge.fury.io/js/${name}.svg)](https://npmjs.org/package/${name})`;
  }

};
exports.badgeRule = badgeRule;

const createTocRule = toc => {
  return {
    re: /^%TOC%$/gm,
    replacement: toc
  };
};

exports.createTocRule = createTocRule;
const commentRule = {
  re: /<!--[\s\S]*?-->\n*/g,

  replacement() {
    LOG('stripping comment');
    return '';
  }

};
exports.commentRule = commentRule;
//# sourceMappingURL=index.js.map