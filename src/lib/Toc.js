import { Transform } from 'stream'
import { collect } from 'catchment'
import { getLink } from '.'
import { methodTitleRe, replaceTitle } from './rules/method-title'
import {
  codeRe, commentRule as stripComments, innerCodeRe, linkTitleRe,
} from './rules'
import tableRule from './rules/table'
import macroRule from './rules/macro'
import {
  Replaceable, makeCutRule, makePasteRule, makeMarkers,
} from 'restream'
import { tableRe } from './rules/table'
import typeRule from './rules/type'
import typedefMdRule from './rules/typedef-md'

const re = /(?:^|\n) *(#+) +(.+)/g

const underline = /^ *([=-]+) *$/gm

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

  const [
    cutTitle, cutLinkTitle, cutCode, cutMethodTitle,
    cutInnerCode, cutTable,
  ] =
    [title, linkTitle, code, methodTitle, innerCode, table].map((marker) => {
      const rule = makeCutRule(marker)
      return rule
    })
  const [
    insertTitle, insertLinkTitle, insertMethodTitle, insertTable,
  ] =
    [title, linkTitle, methodTitle, table].map((marker) => {
      const rule = makePasteRule(marker)
      return rule
    })

  const rs = new Replaceable([
    cutInnerCode, // this ensures no link titles are detected inside of inner code
    // cutTitle, // i don't know why we are doing this
    // cutLinkTitle,

    // make sure those are not cut with code
    cutTable,
    cutMethodTitle,

    // never pasted back
    cutCode,
    stripComments,

    // types will add link titles
    typedefMdRule,
    typeRule,

    // paste those cut out earlier.
    insertMethodTitle,
    insertTable,

    macroRule,
    tableRule,
    // insertLinkTitle,
    // insertTitle,
    // {
    //   re: /[\s\S]*/,
    //   replacement(match) {
    //     debugger
    //     return match
    //   },
    // },
  ])
  rs.end(buffer)
  const b = await collect(rs)
  // console.log(underlined.map)
  return { b, innerCode }
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
    const ts = s.trimRight()
    return ts
  }

  skipLine(level) {
    return this.skipLevelOne && level == 1
  }

  async _transform(buffer, enc, next) {
    const { b, innerCode } = await getBuffer(buffer)

    const getTitle = (title) => {
      const t = title.replace(innerCode.regExp, (m, i) => {
        const val = innerCode.map[i]
        return val
      })
      return t
    }

    const replaceable = new Replaceable([
      {
        re: underline,
        replacement: (match, u, position, input) => {
          const level = u.indexOf('-') + 2 // either 0 or -1
          if (this.skipLine(level)) return match
          const lines = []
          let ok = true
          let s = input.substr(0, position - 1)
          while (ok) {
            const li = s.lastIndexOf('\n')
            const t = s.substr(li + 1)
            const isLine = new RegExp(underline.source).test(t)
            if (isLine) {
              break
            }
            ok = /^ *(?!\s*(?:>|(?:[+*-] )|(?:\d+\.)|(?:# )|`{3,}))[^\s]+.*$/.test(t)
            if (ok) {
              lines.unshift(t)
              s = s.substr(0, s.length - t.length - 1)
            } else {
              break
            }
          }
          const title = `${lines.map(l => l.trim()).join('<br/>')}`
          const t = getTitle(title)
          const link = getLink(t)
          this.addTitle({
            title: t, link, level, position,
          })
          return match
        },
      },
      {
        re,
        replacement: (match, { length: level }, title, position) => {
          if (this.skipLine(level)) return match
          const t = getTitle(title)

          this.addTitle({
            title: t,
            link: getLink(t),
            position,
            level,
          })
          return match
        },
      },
      {
        re: methodTitleRe,
        replacement: (match, hash, isAsync, name, returnType, jsonArgs, position) => {
          try {
            const { length: level } = hash

            if (this.skipLine(level)) return match
            const json = jsonArgs ? jsonArgs : '[]'
            const bb = [isAsync, name]
              .filter(a => a)
              .join(' ').trim()
            const args = JSON.parse(json)
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
          const t = getTitle(title)
          const link = getLink(t)
          this.addTitle({
            title: t,
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
    this.clear()
    next()
  }
  clear() {
    this.titles = []
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
  return res.trimRight()
}

/**
 * @typedef {Object} Config
 * @property {boolean} [skipLevelOne=true] Don't use the first title in the TOC (default `true`).
 */
