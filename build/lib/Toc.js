const { Transform } = require('stream');
const { collect } = require('catchment');
const { getLink } = require('.');
const { methodTitleRe, replaceTitle } = require('./rules/method-title');
const {
  codeRe, commentRule: stripComments, innerCodeRe, linkTitleRe,
} = require('./rules');
let tableRule = require('./rules/table'); if (tableRule && tableRule.__esModule) tableRule = tableRule.default;
let tableMacroRule = require('./rules/macro'); if (tableMacroRule && tableMacroRule.__esModule) tableMacroRule = tableMacroRule.default;
const {
  Replaceable, makeCutRule, makePasteRule, makeMarkers,
} = require('restream');
const { tableRe } = require('./rules/table');
let typeRule = require('./rules/type'); if (typeRule && typeRule.__esModule) typeRule = typeRule.default;
const { typedefMdRe } = require('./rules/typedef-md');
const { macroRule, useMacroRule } = require('./rules/macros');;

const re = /(?:^|\n) *(#+) +(.+)/g

const underline = /^ *([=-]+) *$/gm

class ChunkReplaceable extends Replaceable {
  /**
   * A chunk replaceable needs to be used because we want to process the whole chunk from pedantry first because we will need to sort titles as titles are detected rule-by-rule and not in the natural order.
   * @constructor
   * @param {boolean} skipLevelOne
   * @param {Object.<string,Type[]>} locations
   */
  constructor(skipLevelOne, locations) {
    const {
      methodTitle, code, innerCode, table,
    } = makeMarkers({
      methodTitle: methodTitleRe,
      code: codeRe,
      innerCode: innerCodeRe,
      table: tableRe,
      linkTitle: linkTitleRe,
    })

    const [
      cutCode, cutMethodTitle,
      cutInnerCode, cutTable,
    ] =
      [code, methodTitle, innerCode, table].map((marker) => {
        const rule = makeCutRule(marker)
        return rule
      })
    const [
      insertMethodTitle, insertTable,
    ] =
      [methodTitle, table].map((marker) => {
        const rule = makePasteRule(marker)
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

      // make sure those are not cut with code
      cutTable,
      cutMethodTitle,

      // never pasted back
      cutCode,
      stripComments,

      macroRule,
      useMacroRule,

      // types will add link titles
      {
        re: typedefMdRe,
        replacement(match, location, typeName) {
          const types = locations[location]
          if (!types) {
            return ''
          }
          const t = typeName ? types.filter(a => a.name == typeName) : types
          const tt = t.filter(type => !type.noToc)
          const res = tt.map((type) => {
            return `[\`${type.name}\`](t)` // let toc-titles replacement do the job later
          }).join('\n')
          return res
        },
      },
      typeRule,

      // paste those cut out earlier.
      insertMethodTitle,
      insertTable,

      tableMacroRule,
      tableRule,
      {
        re: underline,
        replacement(match, u, position, input) {
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

          this.emit('title', {
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
        replacement(match, hash, isAsync, name, returnType, jsonArgs, position) {
          try {
            const { length: level } = hash

            if (this.skipLine(level)) return match
            const json = jsonArgs.trim() ? jsonArgs : '[]'
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
        re: linkTitleRe,
        replacement(match, title, l, prefix, position) {
          const t = getTitle(title)
          const link = getLink(t, prefix)
          this.emit('title', {
            title: t,
            ...(l == 't' ? { parentLevel: true } : { level: l.length }),
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

               class Toc extends Transform {
  /**
   * A transform stream which will extract the titles in the markdown document and transform them into a markdown nested list with links.
   * @param {Config} [config] Configuration object.
   * @param {boolean} [config.skipLevelOne=true] Don't use the first title in the TOC (default `true`).
   * @param {Object.<string,Type[]>} locations
   */
  constructor(config = {}) {
    const {
      skipLevelOne = true,
      locations = {},
    } = config

    super()
    this.skipLevelOne = skipLevelOne
    this.locations = locations
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

  async _transform(buffer, enc, next) {
    const cr = new ChunkReplaceable(this.skipLevelOne, this.locations)
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
        this.push('\n')
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
       const getToc = async (stream, h1, locations) => {
  const toc = new Toc({ skipLevelOne: !h1, locations })
  stream.pipe(toc)
  const res = await collect(toc)
  return res.trimRight()
}

/**
 * @typedef {import('./typedef/Type').default} Type
 * @typedef {Object} Config
 * @property {boolean} [skipLevelOne=true] Don't use the first title in the TOC (default `true`).
 */


module.exports = Toc
module.exports.getToc = getToc
//# sourceMappingURL=Toc.js.map