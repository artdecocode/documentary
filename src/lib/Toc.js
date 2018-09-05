import { Transform } from 'stream'
import { collect } from 'catchment'
import { getLink } from '.'
import { methodTitleRe, replaceTitle } from './rules/method-title'
import {
  codeRe, commentRule as stripComments, innerCodeRe, linkTitleRe,
} from './rules'
import {
  Replaceable, makeCutRule, makePasteRule, makeMarkers,
} from 'restream'
import { tableRe } from './rules/table'
import typeRule from './rules/type'
import typedefMdRule from './rules/typedef-md'

const re = /(?:^|\n) *(#+) *(.+)/g

// const underlinedTitleRe = /\s*(?:[^#>-]|)/gm

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
  rs.end(buffer)
  const b = await collect(rs)
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
    this.titles = []
  }

  addTitle({ title, link, position, level, parentLevel }) {
    this.titles.push({
      title, link, position, level, parentLevel,
    })
  }

  getTocLine({ title, link, level }) {
    const heading = `[${title}](#${link})`
    let s
    const lvl = this.skipLevelOne ? level - 1 : level
    if (lvl == 1) {
      s = `- ${heading}`
    } else {
      const p = '  '.repeat(Math.max(lvl - 1, 0))
      s = `${p}* ${heading}`
    }
    return s
  }

  skipLine(level) {
    return this.skipLevelOne && level == 1
  }

  async _transform(buffer, enc, next) {
    const b = await getBuffer(buffer)

    const replaceable = new Replaceable([
      {
        re,
        replacement: (match, { length: level }, title, position) => {
          if (this.skipLine(level)) return match

          this.addTitle({
            title,
            link: getLink(title),
            position,
            level,
          })
          return match
        },
      },
      {
        re: methodTitleRe,
        replacement: (match, hash, isAsync, name, returnType, jsonArgs = '[]', position) => {
          try {
            const { length: level } = hash

            if (this.skipLine(level)) return match
            const bb = [isAsync, name]
              .filter(a => a)
              .join(' ').trim()
            const args = JSON.parse(jsonArgs)
            const s = args.map(([argName, type, shortType]) => {
              let tt
              if (shortType) tt = shortType
              else if (typeof type == 'string') tt = type
              else tt = 'object'
              return `${argName}: ${tt}`
            })
            const fullTitle = replaceTitle(hash, isAsync, name, returnType, jsonArgs)
              .replace(/^#+ +/, '')
            const link = getLink(fullTitle)

            const rt = `${returnType ? `: ${returnType}` : ''}`
            const title = `\`${bb}(${s.join(', ')})${rt}\``
            this.addTitle({
              title,
              link,
              position,
              level,
            })
          } catch (err) {
            // ok
            return match
          }
        },
      },
      {
        re: linkTitleRe,
        replacement: (match, title, l, position) => {
          const link = getLink(title)
          this.addTitle({
            title,
            ...(l == 't' ? { parentLevel: true } : { level: l.length }),
            link,
            position,
          })
          return match
        },
      },
    ])
    replaceable.end(b)
    await collect(replaceable)
    const sorted = this.sortTitles()
    sorted.forEach((title) => {
      if (title.parentLevel) {
        title.level = this.level + 1
      } else {
        this.level = title.level
      }
      const line = this.getTocLine(title)
      this.push(line)
      this.push('\n')
    })
    this.titles = []
    next()
  }
  sortTitles() {
    const sorted = this.titles.sort(({ position: A }, { position: B }) => {
      if (A > B) return 1
      if (A < B) return -1
      return 0
    })
    return sorted
  }
}

export const getToc = async (stream, h1) => {
  const toc = new Toc({ skipLevelOne: !h1 })
  stream.pipe(toc)
  const res = await collect(toc)
  return res.trim()
}

/**
 * @typedef {Object} Config
 * @property {boolean} [skipLevelOne=true] Don't use the first title in the TOC (default `true`).
 */
