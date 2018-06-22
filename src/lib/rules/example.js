import { debuglog } from 'util'
import { parse } from 'path'
import { createReadStream } from 'fs'
import Catchment from 'catchment'

const LOG = debuglog('doc')

const read = async (source) => {
  const rs = createReadStream(source)
  const data = await new Promise(async (r, j) => {
    const { promise } = new Catchment({ rs })
    rs.on('error', j)
    const res = await promise
    r(res)
  })
  return data
}

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
export const re = /^%EXAMPLE: (.[^,]+)(?:, (.+?) => (.[^,]+))?(?:, (.+))?%$/gm

const exampleRule = {
  re,
  replacement: replacer,
}

export default exampleRule
