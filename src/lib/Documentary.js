import { Replaceable, makeMarkers, makeCutRule, makePasteRule } from 'restream'
import { debuglog, isBuffer } from 'util'
import { join, resolve } from 'path'
import { homedir } from 'os'
import write from '@wrote/write'
import { b } from 'erte'
import ensurePath from '@wrote/ensure-path'
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
export default class Documentary extends Replaceable {
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
      disableDtoc, objectMode = true,
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
    const dm = loadComponents(Components, { insertInnerCode })
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
      treeRule,
      ...[
        exampleRule,
        cutCode, // cut code again after inserting example
      ],
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
      const c = require(resolve(`${location}/${name}.json`))
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
      chunk.file != 'separator' && LOG(b(chunk.file, 'cyan'))
      await super._transform(chunk.data, _, next)
    } else {
      throw new Error('what are you')
    }
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
