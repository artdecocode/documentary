"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.linkRe = exports.linkTitleRe = exports.commentRule = exports.innerCodeRe = exports.codeRe = exports.commentRe = exports.createTocRule = void 0;

var _util = require("util");

const LOG = (0, _util.debuglog)('doc');

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
const linkRe = /\[(.+?)\]\(l\)/g;
exports.linkRe = linkRe;
//# sourceMappingURL=index.js.map