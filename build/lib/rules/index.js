const { debuglog } = require('util');

const LOG = debuglog('doc')

       const createTocRule = (toc) => {
  return {
    re: /^%TOC%$/gm,
    replacement: toc,
  }
}

       const commentRe = /<!--[\s\S]*?-->\n*/g

       const codeRe = /^```(`)?(\w+)?\n[\s\S]*?\n```\1/gm

       const innerCodeRe = /`[^`\n]+?`/gm

       const commentRule = {
  re: commentRe,
  replacement() {
    LOG('stripping comment')
    return ''
  },
}

// ^[\n because can be part of a table row
       const linkTitleRe = /\[([^[\n]+?)\]\((t|#+)\)/gm
       const linkRe = /\[(.+?)\]\(l\)/g


module.exports.createTocRule = createTocRule
module.exports.commentRe = commentRe
module.exports.codeRe = codeRe
module.exports.innerCodeRe = innerCodeRe
module.exports.commentRule = commentRule
module.exports.linkTitleRe = linkTitleRe
module.exports.linkRe = linkRe
//# sourceMappingURL=index.js.map