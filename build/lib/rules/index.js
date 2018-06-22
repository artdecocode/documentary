"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.linkTitleRe = exports.commentRule = exports.innerCodeRe = exports.codeRe = exports.commentRe = exports.createTocRule = exports.badgeRule = void 0;

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
const commentRe = /<!--[\s\S]*?-->\n*/g;
exports.commentRe = commentRe;
const codeRe = /^```(`)?(\w+)?\n[\s\S]*?\n```\1/gm;
exports.codeRe = codeRe;
const innerCodeRe = /`[^`\n]+?`/gm;
exports.innerCodeRe = innerCodeRe;
const commentRule = {
  re: commentRe,

  replacement() {
    LOG('stripping comment');
    return '';
  }

};
exports.commentRule = commentRule;
const linkTitleRe = /\[([^[\n]+?)\]\((t|#+)\)/gm;
exports.linkTitleRe = linkTitleRe;
//# sourceMappingURL=index.js.map