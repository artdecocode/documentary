const { parse, join, dirname } = require('path');
const { resolveDependency } = require('../../../stdlib');
const { mismatch } = require('../../../stdlib');
const { read, codeSurround } = require('../');
const { EOL } = require('os');

const getExt = (type, source) => {
  if (type) return type
  const ext = parse(source).ext.replace(/^\./, '')
  if (ext == 'md') return 'markdown'
  return ext
}

const getPartial = (boundExample) => {
  const s = boundExample
    .replace(/^\s*\r?\n/gm, '')
    .replace(/[^\s]/g, '')
  const minLength = s
    .split(EOL)
    .reduce((acc, current) => {
      if (current.length < acc) return current.length
      return acc
    }, Infinity)
  const e = boundExample
    .replace(new RegExp(`^ {${minLength}}`, 'gm'), '')
  return e
}

async function replacer(match, ws, source, from, to, type) {
  try {
    if (source.startsWith('./')) source = join(dirname(this.currentFile), source)
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
    const fre = mismatch(/\/\* start example \*\/([\s\S]+?)\/\* end example \*\//g, f, ['xmpl'])
    if (fre.length) {
      // const [, ...boundExamples] = fre
      const partials = fre.map(({ 'xmpl': x }) => getPartial(x))
      ff = partials.join('')
      this.log('Example (partial): %s', path)
    } else {
      this.log('Example: %s', path)
    }

    const lang = getExt(type, path)
    let res = codeSurround(ff.trim(), lang)
    if (ws) res = res.replace(/^/gm, ws)
    this.addAsset(path)
    return res
  } catch ({ stack }) {
    this.log('Could not read an example from %s.', source)
    this.log(stack)
    return match
  }
}
const re = /^( *)%EXAMPLE: (.[^\r\n,]+)(?:, (.+?) => (.[^\s,]+))?(?:, (.+))?%$/gm

const exampleRule = {
  re,
  replacement: replacer,
}

module.exports=exampleRule


module.exports.replacer = replacer
module.exports.re = re