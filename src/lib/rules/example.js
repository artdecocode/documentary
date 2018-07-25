import { debuglog } from 'util'
import { parse } from 'path'
import { read } from '..'

const LOG = debuglog('doc')

export const replacer = async (match, source, from, to, type) => {
  try {
    let f = await read(source)
    f = f.trim()
    if (from && to) {
      f = f.replace(/^import .+? from ['"](.+)['"]$/mg, (m, fr) => {
        if (fr == from) return m.replace(fr, to)
        return m
      })
    }
    return `\`\`\`${type || parse(source).ext.replace(/^\./, '')}
${f.trim()}
\`\`\``
  } catch (err) {
    LOG(err)
    return match
  }
}
export const re = /^%EXAMPLE: (.[^\n,]+)(?:, (.+?) => (.[^\s,]+))?(?:, (.+))?%$/gm

const exampleRule = {
  re,
  replacement: replacer,
}

export default exampleRule
