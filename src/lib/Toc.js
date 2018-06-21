import { Transform } from 'stream'
import Catchment from 'catchment'
import { getLink, makeARegexFromRule, exactMethodTitle } from '.'
import { methodTitleRe, replaceTitle } from './rules/method-title'
import { commentRe, codeRe } from './rules'

const re = /(?:^|\n) *(#+) *((?:(?!\n)[\s\S])+)\n/
const rre = makeARegexFromRule({ re })

export default class Toc extends Transform {
  /**
   * A transform stream which will extract the titles in the markdown document and transform them into a markdown nested list with links.
   * @param {Config} [config] Configuration object.
   * @param {boolean} [config.skipLevelOne=true] Don't use the first title in the TOC (default `true`).
   */
  constructor(config = {}) {
    const {
      skipLevelOne = true,
    } = config
    super()
    this.skipLevelOne = skipLevelOne
  }
  _transform(buffer, enc, next) {
    let res
    const b = `${buffer}`
      .replace(new RegExp(commentRe, 'g'), '')
      .replace(new RegExp(codeRe, 'g'), (match) => {
        if (exactMethodTitle.test(match) || rre.test(match)) {
          return match
        }
        return '' // ignore code blocks
      })
    const superRe = new RegExp(`(?:${re.source})|(?:${methodTitleRe.source})`, 'g')
    while ((res = superRe.exec(b)) !== null) {
      let t
      let level
      let link
      if (res[1]) { // normal title regex
        const [, { length }, title] = res
        level = length
        if (this.skipLevelOne && level == 1) continue
        t = title
        link = getLink(title)
      } else { // the method title regex
        try {
          const l = res[3]
          level = l.length
          const bb = res.slice(4, 6).filter(a => a).join(' ').trim()
          const json = res[7] || '[]'
          const args = JSON.parse(json)
          const s = args.map(([name, type]) => {
            if (typeof type == 'string') return `${name}: ${type}`
            return `${name}: object`
          })
          const fullTitle = replaceTitle(...res.slice(3)).replace(/^#+ +/, '')
          link = getLink(fullTitle)
          t = `\`${bb}(${s.join(', ')})${res[6] ? `: ${res[6]}` : ''}\``
        } catch (err) {
          // ok
          continue
        }
      }
      const heading = `[${t}](#${link})`
      let s
      if (level == 2) {
        s = `- ${heading}`
      } else {
        const p = '  '.repeat(level - 2)
        s = `${p}* ${heading}`
      }
      this.push(s)
      this.push('\n')
    }
    re.lastIndex = -1
    next()
  }
}

export const getToc = async (stream) => {
  const rs = new Toc()
  stream.pipe(rs)
  const { promise } = new Catchment({ rs })
  const t = await promise
  return t.trim()
}

/**
 * @typedef {Object} Config
 * @property {boolean} [skipLevelOne=true] Don't use the first title in the TOC (default `true`).
 */
