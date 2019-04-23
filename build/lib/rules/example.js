const { debuglog } = require('util');
const { parse } = require('path');
let resolveDependency = require('resolve-dependency'); if (resolveDependency && resolveDependency.__esModule) resolveDependency = resolveDependency.default;
const { read, codeSurround } = require('..');

const LOG = debuglog('doc')

const getExt = (type, source) => {
  if (type) return type
  const ext = parse(source).ext.replace(/^\./, '')
  if (ext == 'md') return 'markdown'
  return ext
}

const getPartial = (boundExample) => {
  const s = boundExample
    .replace(/^\s*\n/gm, '')
    .replace(/[^\s]/g, '')
  const minLength = s
    .split('\n')
    .reduce((acc, current) => {
      if (current.length < acc) return current.length
      return acc
    }, Infinity)
  const e = boundExample
    .replace(new RegExp(`^ {${minLength}}`, 'gm'), '')
  return e
}

       const replacer = async (match, ws, source, from, to, type) => {
  try {
    const { path } = await resolveDependency(source)
    let f = await read(path)
    f = f.trim()
    if (from && to) {
      f = f
        .replace(/^(import\s+[\s\S]+?\s+)(from\s+(['"])(.+)\3)/gm, (m, i, fromSeg, q, fr) => {
          if (fr == from) {
            const r = fromSeg.replace(fr, to)
            return `${i}${r}`
          }
          return m
        })
        .replace(/=\s+require\((['"'])(.+?)\1\)/gm, (m, q, fr) => {
          if (fr == from) return m.replace(fr, to)
          return m
        })
    }

    let ff = f
    const fre = /\/\* start example \*\/([\s\S]+?)\/\* end example \*\//.exec(f)
    if (fre) {
      const [, boundExample] = fre
      ff = getPartial(boundExample)
      LOG('Example (partial): %s', path)
    } else {
      LOG('Example: %s', path)
    }

    const lang = getExt(type, path)
    let res = codeSurround(ff.trim(), lang)
    if (ws) res = res.replace(/^/gm, ws)
    return res
  } catch ({ stack }) {
    LOG('Could not read an example from %s.', source)
    LOG(stack)
    return match
  }
}
       const re = /^( *)%EXAMPLE: (.[^\n,]+)(?:, (.+?) => (.[^\s,]+))?(?:, (.+))?%$/gm

const exampleRule = {
  re,
  replacement: replacer,
}

module.exports=exampleRule


module.exports.replacer = replacer
module.exports.re = re