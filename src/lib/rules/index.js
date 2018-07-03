import { debuglog } from 'util'

const LOG = debuglog('doc')

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
    LOG('stripping comment')
    return ''
  },
}

export const linkTitleRe = /\[([^[\n]+?)\]\((t|#+)\)/gm
