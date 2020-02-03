const createTocRule = (toc) => {
  return {
    re: /^%TOC%$/gm,
    replacement: toc,
  }
}

const commentRe = /<!--[\s\S]*?-->\r?\n*/g

const codeRe = /^( *)```(`)?(?!table$)(\w+)?\r?\n[\s\S]*?\r?\n\1```\2/gm

const innerCodeRe = /`[^`\r\n]+?`/gm

const commentRule = {
  re: commentRe,
  replacement() {
    this.log && this.log('stripping comment')
    return ''
  },
}

// ^[\n because can be part of a table row
const linkTitleRe = /\[([^[\r\n]+?)\]\((t|#+)(?:-([\w\d]+))?\)/gm
const linkRe = /\[([^\r\n\]]+?)\]\(l(?:-([\w\d]+))?\)/gm

module.exports.createTocRule = createTocRule
module.exports.commentRe = commentRe
module.exports.codeRe = codeRe
module.exports.innerCodeRe = innerCodeRe
module.exports.commentRule = commentRule
module.exports.linkTitleRe = linkTitleRe
module.exports.linkRe = linkRe