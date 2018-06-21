import { debuglog } from 'util'

const LOG = debuglog('doc')

export const badgeRule = {
  re: /^%NPM: ([\w\d-_]+)%$/gm,
  replacement(match, name) {
    return `[![npm version](https://badge.fury.io/js/${name}.svg)](https://npmjs.org/package/${name})`
  },
}

export const createTocRule = (toc) => {
  return {
    re: /^%TOC%$/gm,
    replacement: toc,
  }
}

export const commentRe = /<!--[\s\S]*?-->\n*/g

export const codeRe = /```(\w+\n)?[\s\S]*?\n```/g

export const commentRule = {
  re: commentRe,
  replacement() {
    LOG('stripping comment')
    return ''
  },
}
