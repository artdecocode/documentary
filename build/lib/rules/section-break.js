const { join } = require('path');
const { mismatch } = require('../../../stdlib');
const { clone } = require('../../../stdlib');
const { c, b } = require('../../../stdlib');
const { EOL } = require('os');

const sectionBrakeRe = /^%~(?: +(-?\d+))?(?: +(.+))?%$/gm

const rule = {
  re: sectionBrakeRe,
  async replacement(match, number, attrs = '') {
    let n = 0
    try {
      if (number) n = parseInt(number)
      else if (this.sectionBrakeNumber !== undefined) n = this.sectionBrakeNumber == 22
        ? 0                           // reset
        : this.sectionBrakeNumber + 1 // increase from the prev one
      const isEnd = n >= 0
      if (isEnd) this.sectionBrakeNumber = n
      const name = `${n}.svg`
      const imgPath = join(__dirname, '../../section-breaks', name)
      // debugger
      let defaultTo = '.documentary/section-breaks'
      const { wiki } = this._args
      if (wiki) defaultTo = join(wiki, defaultTo)

      const { to, ...a } = mismatch(/(\S+)="(.+?)"/gm, attrs, ['key', 'val'])
        .reduce((acc, { key, val }) => ({ ...acc, [key]: val }), {
          to: defaultTo, // allow override by attributes
          href: '#table-of-contents',
        })

      const nn = `${name}${wiki ? '' : '?sanitize=true'}`
      await clone(imgPath, to)
      let fileName = join(to, nn)
      if (fileName.startsWith(wiki)) fileName = fileName.slice(wiki.length + 1)

      const tags = getTags({ wiki, src: '/' + fileName, ...a })
      return tags
    } catch (err) {
      const h = c(err.message, 'red')
      const [, ...s] = err.stack.split(EOL)
      const st = b(s.join(EOL), 'red')
      const l = `Section break ${n}: ${h}${EOL}${st}`
      this.log(l)
      return match
    }
  },
}

const getTags = ({ wiki, src, href, ...attrs }) => {
  let a = Object.keys(attrs).map(k => {
    const val = attrs[k]
    if (wiki) return `${k}=${val}`
    return `${k}="${val}"`
  }).join(wiki ? ' ' : '|')
  if (a) {
    a = wiki ? `|${a}` : ` ${a}`
  }

  const usrc = src.replace(/\\/g, '/')
  const img = wiki ? `[[${usrc}${a}]]` : `<img src="${usrc}"${a}>`
  const s = `<p align="center"><a href="${href}">
  ${img}
</a></p>`
  return s
}

module.exports=rule

module.exports.sectionBrakeRe = sectionBrakeRe