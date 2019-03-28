export const createTocRule = (toc) => {
  return {
    re: /^%TOC%$/gm,
    replacement: toc,
  }
}

export const commentRe = /<!--[\s\S]*?-->\n*/g

export const codeRe = /^```(`)?(\w+)?\n[\s\S]*?\n```\1/gm

export const innerCodeRe = /`[^`\n]+?`/gm

export const commentRule = {
  re: commentRe,
  replacement() {
    this.log && this.log('stripping comment')
    return ''
  },
}

// ^[\n because can be part of a table row
export const linkTitleRe = /\[([^[\n]+?)\]\((t|#+)(?:-([\w\d]+))?\)/gm
export const linkRe = /\[([^\n\]]+?)\]\(l(?:-([\w\d]+))?\)/gm