import { Transform } from 'stream'
import Catchment from 'catchment'
import { getLink } from '.'
import { methodTitleRe, replaceTitle } from './rules/method-title'
import { codeRe, commentRule as stripComments, innerCodeRe } from './rules'
import { Replaceable } from 'restream/build';
import { makeInitialRule, makeRule, makeMarkers } from './markers'

const re = /(?:^|\n) *(#+) *((?:(?!\n)[\s\S])+)\n/

const getBuffer = async (buffer) => {
  const {
    methodTitle, code, innerCode,
  } = makeMarkers({
    methodTitle: methodTitleRe,
    code: codeRe,
    innerCode: innerCodeRe,
  })

  const [cutCode, cutMethodTitle, cutInnerCode] =
    [code, methodTitle, innerCode].map((marker) => {
      const rule = makeInitialRule(marker)
      return rule
    })
  const [insertMethodTitle, insertInnerCode] =
    [methodTitle, innerCode].map((marker) => {
      const rule = makeRule(marker)
      return rule
    })

  const rs = new Replaceable([
    cutMethodTitle,
    cutCode,
    cutInnerCode,
    stripComments,
    insertInnerCode,
    insertMethodTitle,
  ])
  const c = new Catchment({ rs })
  rs.end(buffer)
  const b = await c.promise
  return b
}
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
  async _transform(buffer, enc, next) {
    let res

    const b = await getBuffer(buffer)
    // create a single regex otherwise titles will always come before method titles
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
