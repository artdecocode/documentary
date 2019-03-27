const { Replaceable, makeMarkers, makeCutRule, makePasteRule } = require('restream');
const { debuglog } = require('util');
const { join, resolve } = require('path');
const { homedir } = require('os');
let write = require('@wrote/write'); if (write && write.__esModule) write = write.default;
let ensurePath = require('@wrote/ensure-path'); if (ensurePath && ensurePath.__esModule) ensurePath = ensurePath.default;
const {
  createTocRule, commentRule: stripComments, codeRe, innerCodeRe, linkTitleRe, linkRe,
} = require('./rules');
const tableRule = require('./rules/table'); const { tableRe } = tableRule;
const methodTitleRule = require('./rules/method-title'); const { methodTitleRe } = methodTitleRule;
const treeRule = require('./rules/tree');
const exampleRule = require('./rules/example');
const forkRule = require('./rules/fork');
const { getLink } = require('.');
const gifRule = require('./rules/gif');
const typeRule = require('./rules/type');
const badgeRule = require('./rules/badge');
const { typedefMdRe } = require('./rules/typedef-md');
const tableMacroRule = require('./rules/macro');
const sectionBrakeRule = require('./rules/section-break');
const { macroRule, useMacroRule } = require('./rules/macros');
const loadComponents = require('./components');
const Components = require('../components/');

const LOG = debuglog('doc')

const getComponents = (path) => {
  try {
    const transforms = require(path)
    const components = loadComponents(transforms)
    return components
  } catch (err) {
    if (!/^Cannot find module/.test(err.message)) {
      console.log(err.stack)
    }
    return []
  }
}

/**
 * Documentary is a _Replaceable_ stream with transform rules for documentation.
 */
               class Documentary extends Replaceable {
  /**
   * @param {DocumentaryOptions} options Options for the Documentary constructor.
 * @param {string} [options.toc] The table of contents to replace the `%TOC%` marker with.
   */
  constructor(options = {}) {
    const {
      toc, locations = {}, types: allTypes = [],
      cwd = '.', cacheLocation = './.documentary/cache',
    } = options
    const hm = getComponents(join(homedir(), '.documentary'))
    const cm = getComponents(resolve(cwd, '.documentary'))
    const dm = loadComponents(Components)
    const components = [...cm, ...hm, ...dm]
    // console.log('loaded components %s', components)
    const tocRule = createTocRule(toc)

    const {
      table, methodTitle, code, innerCode, linkTitle,
    } = makeMarkers({
      table: tableRe,
      methodTitle: methodTitleRe,
      code: codeRe,
      innerCode: innerCodeRe,
      linkTitle: linkTitleRe,
    })

    /* below have ``` in them, therefore we want more control over handling them
    * so that Replaceable does not confuse them with the code blocks.
    */
    const [cutCode, cutTable, cutMethodTitle, cutInnerCode] =
      [code, table, methodTitle, innerCode, linkTitle].map((marker) => {
        const rule = makeCutRule(marker)
        return rule
      })
    const [insertCode, insertTable, insertMethodTitle, insertInnerCode] =
      [code, table, methodTitle, innerCode, linkTitle].map((marker) => {
        const rule = makePasteRule(marker)
        return rule
      })

    super([
      cutInnerCode, // don't want other rules being detected inside of inner code, including toc-titles
      cutTable,
      cutMethodTitle,
      cutCode,
      stripComments,

      macroRule,
      useMacroRule,

      badgeRule,
      treeRule,
      ...[
        exampleRule,
        cutCode, // cut code again after inserting example
      ],
      forkRule,
      tocRule,
      gifRule,
      typeRule,
      sectionBrakeRule,
      ...[
        ...components, // todo: restream pipe
        cutCode, // cut code again after inserting components
      ],
      insertTable,
      // typedefMdRule, // places a table hence just before table

      {
        re: typedefMdRe,
        replacement(match, location, typeName) {
          const types = locations[location]
          if (!types) {
            LOG('No types for location %s.', location)
            return ''
          }
          const t = typeName ? types.filter(a => a.name == typeName) : types
          const res = t.map((type) => {
            return type.toMarkdown(allTypes)
          }).join('\n\n')
          return res
        },
      },

      tableMacroRule, // macro is for the table
      tableRule,

      {
        re: linkTitleRe,
        replacement(match, title, l, prefix) {
          const t = this.replaceInnerCode(title)
          const link = getLink(t, prefix)
          return `<a name="${link}">${t}</a>`
        },
      },
      {
        re: linkRe, // TODO implement links system
        replacement(match, title, prefix) {
          // TODO replace inner code as well
          const link = getLink(title, prefix)
          return `<a name="${link}">${title}</a>`
        },
      },
      insertMethodTitle,
      methodTitleRule,

      insertCode,
      insertInnerCode,
      // those found inside of code blocks
      insertTable,
      insertMethodTitle,
    ])

    this._types = {}

    this._innerCode = innerCode

    this.on('types', types => {
      types.forEach(this.addType.bind(this))
    })
    this._cacheLocation = cacheLocation
  }
  get innerCode() {
    return this._innerCode
  }
  getCache(name, location = this._cacheLocation) {
    try {
      const c = require(resolve(`${location}/${name}.json`))
      return c
    } catch (err) {
      return null
    }
  }
  async addCache(name, record, location = this._cacheLocation) {
    const path = resolve(`${location}/${name}.json`)
    await ensurePath(path)
    let c
    try {
      c = require(path)
    } catch (err) {
      c = {}
    }
    const cc = { ...c, ...record }
    const s = JSON.stringify(cc, null, 2)
    await write(path, s)
  }
  /**
   * Replace a marked inner code with its actual value.
   * @param {string} data
   */
  replaceInnerCode(data) {
    const s = data.replace(this.innerCode.regExp, (m, i) => {
      const val = this.innerCode.map[i]
      return val
    })
    return s
  }
  get log() {
    return LOG
  }
  addType(name) {
    this.types[name] = true
  }
  get types() {
    return this._types
  }
}

/* documentary types/Documentary.xml */
/**
 * @typedef {Object} DocumentaryOptions Options for the Documentary constructor.
 * @prop {string} [toc] The table of contents to replace the `%TOC%` marker with.
 */


module.exports = Documentary