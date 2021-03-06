import { Transform } from 'stream'
import { collect } from 'catchment'
import { getLink } from '.'
import { codeRe, innerCodeRe } from './rules'
import { Replaceable, makeCutRule, makeMarkers } from 'restream'
import { EOL } from 'os'

const re = /(?:^|\r?\n) *(#+) +(.+)/g

const underline = /^ *([=-]+) *$/gm

class ChunkReplaceable extends Replaceable {
  /**
   * A chunk replaceable needs to be used because we want to process the whole chunk from pedantry first because we will need to sort titles as titles are detected rule-by-rule and not in the natural order.
   * @constructor
   * @param {boolean} skipLevelOne
   * @param {Object.<string,Type[]>} locations
   */
  constructor(skipLevelOne, getDtoc) {
    const {
      code, innerCode,
    } = makeMarkers({
      code: codeRe,
      innerCode: innerCodeRe,
    })

    const [cutCode, cutInnerCode] =
      [code, innerCode].map((marker) => {
        const rule = makeCutRule(marker)
        return rule
      })

    const getTitle = (title) => {
      const t = title.replace(innerCode.regExp, (m, i) => {
        const val = innerCode.map[i]
        return val
      })
      return t
    }

    const rules = [
      cutInnerCode, // this ensures no link titles are detected inside of inner code
      cutCode, // never pasted back
      {
        re: underline,
        replacement(match, u, position, input) {
          // const actual = match[0]
          let level
          if (match[0] == '-') level = 2
          else if (match[0] == '=') level = 1
          // if (this.skipLevelOne) level++
          // const level = u.indexOf('-') + 2 // either 0 or -1
          if (this.skipLine(level)) return match
          const lines = []
          let ok = true
          let s = input.substr(0, position - 1)
          while (ok) {
            const li = s.lastIndexOf('\n') // eol not needed
            const t = s.substr(li + 1)
            const isLine = new RegExp(underline.source).test(t)
            if (isLine) {
              break
            }
            ok = /^ *(?!\s*(?:>|(?:[+*-] )|(?:\d+\.)|(?:# )|`{3,}))[^\s]+.*$/.test(t)
            if (ok) {
              const ft = t.replace(/\[(.+?)\]\(.+?\)/g, '$1')
              lines.unshift(ft)
              s = s.substr(0, s.length - t.length - 1)
            } else {
              break
            }
          }
          const title = `${lines.map(l => l.trim()).join('<br/>')}`
          if (!title) return match
          const t = getTitle(title)
          const link = getLink(t)
          this.emit('title', {
            title: t, link, level, position,
          })
          return match
        },
      },
      {
        re,
        replacement(match, { length: level }, title, position) {
          if (this.skipLine(level)) return match
          const t = getTitle(title)
          const lt = t.replace(/__(.+?)__/g, '$1')
            .replace(/\*\*(.+?)\*\*/g, '$1')
            .replace(/_(.+?)_/g, '$1')
            .replace(/\*(.+?)\*/g, '$1')

          this.emit('title', {
            title: t,
            link: getLink(lt),
            position,
            level,
          })
          return match
        },
      },
      {
        re: /%%DTOC_MT_(\d+)%%/g,
        replacement(match, int, position) {
          const {
            hash, isAsync, name, returnType, args, replacedTitle,
            noArgTypesInToc, string,
          } = getDtoc('MT', int)
          try {
            const { length: level } = hash
            if (this.skipLine(level)) return match

            const fullTitle = replacedTitle
              .replace(/^#+ +/, '')
            const link = getLink(fullTitle)

            if (string) {
              this.emit('title', {
                title: string,
                link,
                position,
                level,
              })
              return
            }

            const bb = [isAsync ? 'async' : '', name]
              .filter(a => a)
              .join(' ').trim()
            const s = args.map(([argName, type, shortType]) => {
              if (noArgTypesInToc) return argName
              let tt
              if (shortType) tt = shortType
              else if (typeof type == 'string') tt = type
              else tt = 'object'
              return `${argName}: ${tt}`
            })

            const rt = `${returnType ? `: ${returnType}` : ''}`
            const title = `\`${bb}(${s.join(', ')})${rt}\``
            this.emit('title', {
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
        re: /%%DTOC_LT_(\d+)%%/g,
        replacement(match, int, position) {
          const { title, link, level } = getDtoc('LT', int)
          this.emit('title', {
            title,
            ...(level == 't' ? { parentLevel: true } : { level: level.length }),
            link,
            position,
          })
          return match
        },
      },
    ]
    super(rules)
    this.skipLevelOne = skipLevelOne
  }

  skipLine(level) {
    return this.skipLevelOne && level == 1
  }
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
      documentary,
    } = config

    super()
    this.skipLevelOne = skipLevelOne
    this.level = 0
    this.titles = []
    this.getDtoc = documentary ? documentary.getDtoc.bind(documentary) : () => {}
  }

  addTitle({ title, link, position, level, parentLevel }) {
    this.titles.push({
      title, link, position, level, parentLevel,
    })
    if (!this.hasToc && link == 'table-of-contents') this.hasToc = true
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

  async _transform(buffer, enc, next) {
    const cr = new ChunkReplaceable(this.skipLevelOne, this.getDtoc)
    cr
      .on('title', t => this.addTitle(t))
      .end(buffer)

    try {
      await collect(cr)
      const sorted = this.sortTitles()
      sorted.forEach((title) => {
        if (title.parentLevel) {
          title.level = this.level + 1
        } else {
          this.level = title.level
        }
        const line = this.getTocLine(title)
        this.push(line)
        this.push(EOL)
      })
      this.clear()
      next()
    } catch (err) {
      next(err)
    }
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

/**
 * Gather all titles from the stream and return the table of contents as a string.
 * @returns {string} The table of contents.
 */
export const getToc = async (stream, h1, locations, justToc = false) => {
  const toc = new Toc({
    skipLevelOne: !h1, locations, documentary: stream,
  })
  stream.pipe(toc)
  const res = await collect(toc)
  return (justToc || toc.hasToc ? '' : tocA) + res.trimRight()
}

const tocA = `<a name="table-of-contents"></a>${EOL}${EOL}`

/**
 * @typedef {import('./typedef/Type').default} Type
 * @typedef {Object} Config
 * @property {boolean} [skipLevelOne=true] Don't use the first title in the TOC (default `true`).
 */
