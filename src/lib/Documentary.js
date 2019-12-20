import { Replaceable, makeMarkers, makeCutRule, makePasteRule } from 'restream'
import { isBuffer } from 'util'
import { join, resolve, basename } from 'path'
import { homedir } from 'os'
import write from '@wrote/write'
import { b } from 'erte'
import ensurePath, { ensurePathSync } from '@wrote/ensure-path'
import makePromise from 'makepromise'
import { lstat as Stat, writeFileSync, readFileSync } from 'fs'
import { commentRule as stripComments, codeRe, innerCodeRe, linkTitleRe, linkRe } from './rules'
import tableRule, { tableRe } from './rules/table'
import methodTitleRule, { methodTitleRe } from './rules/method-title'
import treeRule from './rules/tree'
import exampleRule from './rules/example'
import forkRule from './rules/fork'
import { getLink } from './'
import gifRule from './rules/gif'
import typeRule from './rules/type'
import badgeRule from './rules/badge'
import { typedefMdRe } from './rules/typedef-md'
import tableMacroRule from './rules/macro'
import sectionBrakeRule from './rules/section-break'
import { macroRule, useMacroRule } from './rules/macros'
import loadComponents from './components'
import * as Components from '../components/'
import Method from '../components/method'

/**
 * @return {import('fs').Stats}
 */
export const stat = async (path) => {
  return await makePromise(Stat, path)
}

const LOG = /doc/.test(process.env.NODE_DEBUG) ? console.error : (() => {})

const getComponents = (paths, getDocumentary) => {
  let method = Method
  const transforms = paths.reduce((acc, path) => {
    try {
      const required = require(path) // an object
      Object.entries(required).forEach(([key, e]) => {
        if (key == 'method') {
          method = e
          return
        }
        if (acc[key] && acc[key] !== e) console.error('Overriding component <%s> by new one from %s', key, path)
        acc[key] = e
      })
      return acc
    } catch (err) {
      if (!/^Cannot find module/.test(err.message)) {
        console.log(err.stack)
      }
      return acc
    }
  }, Components)
  const components = loadComponents(transforms, getDocumentary)
  return { method, components }
}

const SKIP_USER_COMPONENTS = process.env.DOCUMENTARY_SKIP_USER_COMPONENTS
  && process.env.DOCUMENTARY_SKIP_USER_COMPONENTS != 'false'

const { DOCUMENTARY_CWD: CWD = '.' } = process.env
let { DOCUMENTARY_IGNORE_HIDDEN: IGNORE_HIDDEN = true } = process.env
if (IGNORE_HIDDEN) IGNORE_HIDDEN = IGNORE_HIDDEN != 'false'

/**
 * Documentary is a _Replaceable_ stream with transform rules for documentation.
 */
export default class Documentary extends Replaceable {
  /**
   * @param {Object} options Options for the Documentary constructor.
   * @param {import('./Typedefs').default} [options.typedefs] Pre-extracted typedefs.
   * @param {string} [options.wiki] If processing Wiki, specifies the output location.
   * @param {string} [options.source] The location of the source file or directory from which the documentation is compiled.
   * @param {string} [options.output] The location where to save the `README.md` file.
   * @param {string} [options.cwd="."] The `cwd` that is used to resolve `.documentary` folder. Default `.`.
   * @param {string} [options.cacheLocation="${cwd}/.documentary/cache"] The folder where the cache is kept. Default `${cwd}/.documentary/cache`.
   * @param {boolean} [options.noCache=false] Disable caching for forks. Default `false`.
   * @param {boolean} [options.disableDtoc=false] Assume that no table of contents will be generated afterwards. Disables adding of `%%DTOC_MT_N%%` and `%%DTOC_LT_N%%` strings that would be used later by TOC generator and removed by the `run` method manually. Default `false`.
   */
  constructor(options = {}) {
    const {
      typedefs,
      cwd = CWD, cacheLocation = join(cwd, '.documentary/cache'),
      noCache, disableDtoc, objectMode = true /* deprec */,
      wiki, output, source, // options to remember
      skipUserComponents = SKIP_USER_COMPONENTS,
      skipHomedirComponents = false,
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

    const compPaths = [
      ...(skipHomedirComponents ? [] : [join(homedir(), '.documentary')]),
      resolve(cwd, '.documentary'),
    ]

    const { method, components } = getComponents(skipUserComponents ? [] : compPaths, () => this)

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
          const types = this.locations[location]
          if (!types) {
            LOG('No types for location %s.', location)
            return ''
          }
          const t = typeName ? types.filter(a => a.name == typeName) : types
          const res = t.map((type) => {
            const { LINE, table: tb } = type.toMarkdown(this.allTypes)
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

    this.Method = method // the method component can be overridden by users.

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

    /** The args passed to the program. */
    this._args = {
      /** The location of the source file or directory from which the documentation is compiled. */
      source,
      /** If processing Wiki, specifies the output location. */
      wiki,
      /** The location where to save the `README.md` file. */
      output,
    }

    this.cut = {
      code: cutCode,
      table: cutTable,
      methodTitle: methodTitle,
      innerCode: innerCode,
    }
    this.insert = {
      code: insertCode,
      table: insertTable,
      methodTitle: insertMethodTitle,
      innerCode: insertInnerCode,
    }
    this._typedefs = typedefs
    if (this._typedefs) {
      // update imports
      this._typedefs.updateImports()
    }
    this._addedFiles = {}
  }
  /**
   * The source locations of types, e.g., types/index.xml.
   */
  get locations() {
    if (this._typedefs) return this._typedefs.locations
    return {}
  }
  /**
   * All extracted types across every processed file.
   */
  get allTypes() {
    if (this._typedefs) {
      return this._typedefs.types
    }
    return []
  }
  /**
   * The list of types also with types from typedefs.json
   */
  get allTypesWithIncluded() {
    const { _typedefs } = this
    if (_typedefs) {
      return [..._typedefs.types, ..._typedefs.included]
    }
    return []
  }

  /**
   * Adds the file to `.documentary` folder, considering for wiki
   * and returns the path that can be used online.
   * @param {string} file path to the file.
   * @param {...string} innerPath Any folders inside the .documentary.
   */
  addFile(file, ...innerPath) {
    const added = this._addedFiles[file]
    if (added) return added
    const path = join('.documentary', ...innerPath, basename(file))
    const to = this._args.wiki ? join(this._args.wiki, path) : path
    ensurePathSync(to)
    writeFileSync(to, readFileSync(file))
    this._addedFiles[file] = path
    return path
  }

  /**
   * Gets the change time in user's locale. Used for cache.
   * @param {string} source
   */
  async getLocaleChangeTime(source) {
    const s = await stat(source)
    const mtime = s.mtime.toLocaleString()
    return mtime
  }

  /**
   * Adds some information for generating TOC later.
   * @param {string} name
   * @param {Object} value
   * @param {string} [value.string] The string to display in TOC. Cancels out other options apart from `level`.
   * @param {string} [value.level] The level at which to display the title.
   * @param {string} [value.hash] The hash indicating the level, e.g., `###`.
   * @param {string} [value.replacedTitle] The actual title that will be display in README.
   * @param {boolean} [value.isAsync]
   * @param {string} [value.name]
   * @param {string} [value.returnType]
   * @param {Array} [value.args]
   * @param {boolean} [value.noArgTypesInToc]
   */
  addDtoc(name, value) {
    if (this._disableDtoc) return ''
    if (!this._dtoc[name]) this._dtoc[name] = []
    const arr = this._dtoc[name]
    if (value.level) value.hash = '#'.repeat(value.level)
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
  getCache(name, location = this._cacheLocation, item) {
    try {
      const p = resolve(`${location}/${name}.json`)
      delete require.cache[p]
      const c = require(p)
      if (item) {
        if (item in c) return c[item]
        return {}
      }
      return c
    } catch (err) {
      return {}
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
      if (/\.(jsx?|xml|png|jpe?g|gif|svg)$/i.test(chunk.file)) return next()
      if (IGNORE_HIDDEN && basename(chunk.file).startsWith('.')) return next()
      chunk.file != 'separator' && LOG(b(chunk.file, 'cyan'))
      /** @type {string} */
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
  /**
   * Render the result of the component again.
   * This is needed when a component might contain other components when rendered.
   */
  renderAgain() {
    // overridden by src/lib/components.js for each component
  }
  /**
   * The function which controls whether to enable pretty printing, and the line width.
   * @param {boolean} [isPretty=true] Whether to enable pretty printing. Default `true`.
   * @param {number} [lineLength] When to break the line. Default `100`.
   */
  setPretty(isPretty, lineLength) {
    // overridden by src/lib/components.js for each component
  }
}

/* typal types/Documentary.xml namespace */
/**
 * @typedef {import('typal/types').Type} _typal.Type
 * @typedef {Object} DocumentaryOptions Options for the Documentary constructor.
 * @prop {!Object<string, !Array<_typal.Type>} [locations] The source locations of types, e.g., types/index.xml.
 * @prop {!Array<_typal.Type>} [types] All extracted types across every processed file.
 * @prop {string} [wiki] If processing Wiki, specifies the output location.
 * @prop {string} [source] The location of the source file or directory from which the documentation is compiled.
 * @prop {string} [output] The location where to save the `README.md` file.
 * @prop {string} [cwd="."] The `cwd` that is used to resolve `.documentary` folder. Default `.`.
 * @prop {string} [cacheLocation="${cwd}/.documentary/cache"] The folder where the cache is kept. Default `${cwd}/.documentary/cache`.
 * @prop {boolean} [noCache=false] Disable caching for forks. Default `false`.
 * @prop {boolean} [disableDtoc=false] Assume that no table of contents will be generated afterwards. Disables adding of `%%DTOC_MT_N%%` and `%%DTOC_LT_N%%` strings that would be used later by TOC generator and removed by the `run` method manually. Default `false`.
 */
