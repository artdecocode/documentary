const { Replaceable, makeMarkers, makeCutRule, makePasteRule } = require('restream');
const { debuglog, isBuffer } = require('util');
const { join, resolve, basename } = require('path');
const { homedir } = require('os');
let write = require('@wrote/write'); if (write && write.__esModule) write = write.default;
const { b } = require('erte');
let ensurePath = require('@wrote/ensure-path'); if (ensurePath && ensurePath.__esModule) ensurePath = ensurePath.default;
const { commentRule: stripComments, codeRe, innerCodeRe, linkTitleRe, linkRe } = require('./rules');
const tableRule = require('./rules/table'); const { tableRe } = tableRule;
const methodTitleRule = require('./rules/method-title'); const { methodTitleRe } = methodTitleRule;
const treeRule = require('./rules/tree');
const exampleRule = require('./rules/example');
const forkRule = require('./rules/fork');
const { getLink } = require('./');
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
   * @param {*} [options.locations]
   * @param {Array} [options.types]
   * @param {string} [options.cwd="."] The `cwd` that is used to resolve `.documentary` folder. Default `.`.
   * @param {string} [options.cacheLocation="${cwd}/.documentary/cache"] The folder where the cache is kept. Default `${cwd}/.documentary/cache`.
   * @param {boolean} [options.noCache=false] Disable caching for forks. Default `false`.
   * @param {boolean} [options.disableDtoc=false] Assume that no table of contents will be generated afterwards. Disables adding of `%%DTOC_MT_N%%` and `%%DTOC_LT_N%%` strings that would be used later by TOC generator and removed by the `run` method manually. Default `false`.
   */
  constructor(options = {}) {
    const {
      locations = {}, types: allTypes = [],
      cwd = '.', cacheLocation = join(cwd, '.documentary/cache'), noCache,
      disableDtoc, objectMode = true /* deprec */,
      wiki, output, source, // options to remember
    } = options

    // console.log('loaded components %s', components)
    // const tocRule = createTocRule(toc)

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

    const hm = getComponents(join(homedir(), '.documentary'))
    const cm = getComponents(resolve(cwd, '.documentary'))
    // this is the service property to components
    const documentary = {
      insertInnerCode, locations, allTypes, cutCode, wiki, source,
      currentFile: () => { return this.currentFile },
    }
    const dm = loadComponents(Components,  documentary)
    const components = [...cm, ...hm, ...dm]

    super([
      cutInnerCode, // don't want other rules being detected inside of inner code, including toc-titles
      cutTable,
      cutMethodTitle,
      cutCode,
      stripComments,

      macroRule,
      useMacroRule,

      badgeRule,

      forkRule,
      // tocRule,
      {
        re: /^%TOC%$/gm,
        replacement: '%%_DOCUMENTARY_TOC_CHANGE_LATER_%%',
      },
      gifRule,
      typeRule,
      sectionBrakeRule,
      ...[
        ...components, // todo: restream pipe
        cutTable,
        cutCode, // cut code again after inserting components
      ],
      ...[
        exampleRule,
        cutCode, // cut code again after inserting example
      ],
      treeRule,
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
            const { LINE, table: tb } = type.toMarkdown(allTypes)
            return `${LINE}${tb}`
          }).join('\n\n')
          return res
        },
      },

      tableMacroRule, // macro is for the table
      tableRule,
      {
        re: linkTitleRe,
        replacement(match, title, level, prefix) {
          const t = this.replaceInnerCode(title)
          const link = getLink(t, prefix)
          const dtoc = this.addDtoc('LT', {
            title: t, link, level,
          })
          return `${dtoc}<a name="${link}">${t}</a>`
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
    ], { objectMode })

    this._types = {}

    this._innerCode = innerCode

    this.on('types', types => {
      types.forEach(this.addType.bind(this))
    })
    this._cacheLocation = cacheLocation
    this._dtoc = {}
    // disables caching in forks
    this.noCache = noCache
    this._disableDtoc = disableDtoc
    this.writingCache = Promise.resolve()

    /**
     * The list of files referenced in documentation: examples, forks.
     * @type {!Array<string>}
     */
    this.assets = []
    /**
     * The args passed to the program.
     */
    this._args = {
      output, wiki, source,
    }
  }
  /**
   * Adds some information for generating TOC later.
   * @param {string} name
   */
  addDtoc(name, value) {
    if (this._disableDtoc) return ''
    if (!this._dtoc[name]) this._dtoc[name] = []
    const arr = this._dtoc[name]
    arr.push(value)
    return `%%DTOC_${name}_${arr.length - 1}%%`
  }
  /**
   * Used by the Toc stream later to create lines for link and method titles.
   */
  getDtoc(name, int) {
    return this._dtoc[name][int]
  }
  get innerCode() {
    return this._innerCode
  }
  getCache(name, location = this._cacheLocation) {
    try {
      const p = resolve(`${location}/${name}.json`)
      delete require.cache[p]
      const c = require(p)
      return c
    } catch (err) {
      return undefined
    }
  }
  async addCache(name, record, location = this._cacheLocation) {
    this.writingCache = this.writingCache.then(() => {
      return new Promise(async (r, j) => {
        try {
          const path = resolve(`${location}/${name}.json`)
          await ensurePath(path)
          let c
          try {
            delete require.cache[path]
            c = require(path)
          } catch (err) {
            c = {}
          }
          const cc = { ...c, ...record }
          const s = JSON.stringify(cc, null, 2)
          await write(path, s)
          r()
        } catch (err) {
          return j(err)
        }
      })
    })
    await this.writingCache
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
  async _transform(chunk, _, next) {
    if (isBuffer(chunk) || typeof chunk == 'string') {
      await super._transform(chunk, _, next)
    } else if (typeof chunk == 'object') {
      if (basename(chunk.file) == '.DS_Store') return next()
      chunk.file != 'separator' && LOG(b(chunk.file, 'cyan'))
      this.currentFile = chunk.file
      await super._transform(chunk.data, _, next)
    } else {
      throw new Error('what are you')
    }
  }
  /** @param {string} asset */
  addAsset(asset) {
    if (!this.assets.includes(asset)) this.assets.push(asset)
  }
}

/* documentary types/Documentary.xml */
/**
 * @typedef {Object} DocumentaryOptions Options for the Documentary constructor.
 * @prop {*} [locations]
 * @prop {Array} [types]
 * @prop {string} [cwd="."] The `cwd` that is used to resolve `.documentary` folder. Default `.`.
 * @prop {string} [cacheLocation="${cwd}/.documentary/cache"] The folder where the cache is kept. Default `${cwd}/.documentary/cache`.
 * @prop {boolean} [noCache=false] Disable caching for forks. Default `false`.
 * @prop {boolean} [disableDtoc=false] Assume that no table of contents will be generated afterwards. Disables adding of `%%DTOC_MT_N%%` and `%%DTOC_LT_N%%` strings that would be used later by TOC generator and removed by the `run` method manually. Default `false`.
 */


module.exports = Documentary