export const createTocRule = (toc) => {
  return {
    re: /^%TOC%$/gm,
    replacement: toc,
  }
}

export const commentRe = /<!--[\s\S]*?-->\r?\n*/g

export const codeRe = /^( *)```(`)?(?!table$)(\w+)?\r?\n[\s\S]*?\r?\n\1```\2/gm

export const innerCodeRe = /`[^`\r\n]+?`/gm

export const commentRule = {
  re: commentRe,
  replacement() {
    this.log && this.log('stripping comment')
    return ''
  },
}

// ^[\n because can be part of a table row
export const linkTitleRe = /\[([^[\r\n]+?)\]\((t|#+)(?:-([\w\d]+))?\)/gm
export const linkRe = /\[([^\r\n\]]+?)\]\(l(?:-([\w\d]+))?\)/gm