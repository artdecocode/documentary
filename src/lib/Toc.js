import { Transform } from 'stream'
import Catchment from 'catchment'
import { getLink } from '.'
import { methodTitleRe, replaceTitle } from './rules/method-title'
import { codeRe, commentRule as stripComments, innerCodeRe, linkTitleRe } from './rules'
import { Replaceable } from 'restream'
import { makeCutRule, makePasteRule, makeMarkers } from 'restream'
import { tableRe } from './rules/table'
import typeRule from './rules/type'
import typedefMdRule from './rules/typedef-md'

const re = /(?:^|\n) *(#+) *((?:(?!\n)[\s\S])+)\n/

const getBuffer = async (buffer) => {
  const {
    title, methodTitle, code, innerCode, table, linkTitle,
  } = makeMarkers({
    title: /^ *#+.+/gm,
    methodTitle: methodTitleRe,
    code: codeRe,
    innerCode: innerCodeRe,
    table: tableRe,
    linkTitle: linkTitleRe,
  })

  const [cutTitle, cutLinkTitle, cutCode, cutMethodTitle, cutInnerCode, cutTable] =
    [title, linkTitle, code, methodTitle, innerCode, table].map((marker) => {
      const rule = makeCutRule(marker)
      return rule
    })
  const [insertTitle, insertLinkTitle, insertMethodTitle, insertInnerCode, insertTable] =
    [title, linkTitle, methodTitle, innerCode, table].map((marker) => {
      const rule = makePasteRule(marker)
      return rule
    })

  const rs = new Replaceable([
    cutTitle,
    cutInnerCode,
    cutLinkTitle,
    {
      re: innerCode.regExp,
      replacement() {
        return ''
      },
    },
    cutTable,
    cutMethodTitle,
    cutCode,
    stripComments,
    typedefMdRule,
    typeRule,
    insertMethodTitle,
    insertTable,
    insertLinkTitle,
    insertInnerCode,
    insertTitle,
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
    this.level = 0
  }
  async _transform(buffer, enc, next) {
    let res

    const b = await getBuffer(buffer)
    // create a single regex otherwise titles will always come before method titles
    const superRe = new RegExp(`(?:${re.source})|(?:${methodTitleRe.source})|(?:${linkTitleRe.source})`, 'g')
    while ((res = superRe.exec(b)) !== null) {
      let t
      let level
      let link
      if (res[8] && res[9]) {
        t = res[8]
        level = res[9] != 't' ? res[9].length : this.level + 1
        link = getLink(t)
      } else if (res[1]) { // normal title regex
        const [, { length }, title] = res
        this.level = length
        if (this.skipLevelOne && this.level == 1) continue
        t = title
        link = getLink(title)
      } else { // the method title regex
        try {
          const { length } = res[3]
          this.level = length
          if (this.skipLevelOne && this.level == 1) continue
          const bb = res.slice(4, 6).filter(a => a).join(' ').trim()
          const json = res[7] || '[]'
          const args = JSON.parse(json)
          const s = args.map(([name, type, shortType]) => {
            let tt
            if (shortType) tt = shortType
            else if (typeof type == 'string') tt = type
            else tt = 'object'
            return `${name}: ${tt}`
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
      if (!level) level = this.level
      level = this.skipLevelOne ? level - 1 : level
      if (level == 1) {
        s = `- ${heading}`
      } else {
        const p = '  '.repeat(Math.max(level - 1, 0))
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
