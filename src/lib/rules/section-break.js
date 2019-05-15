import { join } from 'path'
import mismatch from 'mismatch'
import clone from '@wrote/clone'
import { debuglog } from 'util'
import { c, b } from 'erte'

const LOG = debuglog('doc')

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
      const { to, ...a } = mismatch(/(.+)="(.+)"/gm, attrs, ['key', 'val'])
        .reduce((acc, { key, val }) => ({ ...acc, [key]: val }), {
          to: '.documentary/section-breaks',
        })

      const nn = `${name}?sanitize=true`
      await clone(imgPath, to)

      const tags = getTags({ src: '/' + join(to, nn), ...a })
      return tags
    } catch (err) {
      const h = c(err.message, 'red')
      const [, ...s] = err.stack.split('\n')
      const st = b(s.join('\n'), 'red')
      const l = `Section break ${n}: ${h}\n${st}`
      LOG(l)
      return match
    }
  },
}

const getTags = ({
  href = '#table-of-contents',
  ...attrs
}) => {
  const a = Object.keys(attrs).map(k => `${k}="${attrs[k]}"`).join(' ')
  const s = `<p align="center"><a href="${href}"><img ${a}></a></p>`
  return s
}

export { sectionBrakeRe }
export default rule