import { join } from 'path'
import mismatch from 'mismatch'
import clone from '@wrote/clone'
import { c, b } from 'erte'

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
      const [, ...s] = err.stack.split('\n')
      const st = b(s.join('\n'), 'red')
      const l = `Section break ${n}: ${h}\n${st}`
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

  const img = wiki ? `[[${src}${a}]]` : `<img src="${src}"${a}>`
  const s = `<p align="center"><a href="${href}">
  ${img}
</a></p>`
  return s
}

export { sectionBrakeRe }
export default rule