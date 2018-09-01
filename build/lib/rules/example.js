const { debuglog } = require('util');
const { parse } = require('path');
const { read } = require('..');

const LOG = debuglog('doc')

const getExt = (type, source) => {
  return type || parse(source).ext.replace(/^\./, '')
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

       const replacer = async (match, source, from, to, type) => {
  try {
    let f = await read(source)
    f = f.trim()
    if (from && to) {
      f = f.replace(/^import .+? from ['"](.+)['"]$/mg, (m, fr) => {
        if (fr == from) return m.replace(fr, to)
        return m
      })
    }

    let ff = f
    const fre = /\/\* start example \*\/([\s\S]+?)\/\* end example \*\//.exec(f)
    if (fre) {
      const [, boundExample] = fre
      ff = getPartial(boundExample)
      LOG('Example (partial): %s', source)
    } else {
      LOG('Example: %s', source)
    }

    return `\`\`\`${getExt(type, source)}
${ff.trim()}
\`\`\``
  } catch (err) {
    LOG(err)
    return match
  }
}
       const re = /^%EXAMPLE: (.[^\n,]+)(?:, (.+?) => (.[^\s,]+))?(?:, (.+))?%$/gm

const exampleRule = {
  re,
  replacement: replacer,
}

module.exports=exampleRule


module.exports.replacer = replacer
module.exports.re = re
//# sourceMappingURL=example.js.map