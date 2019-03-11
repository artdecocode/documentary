import { Replaceable, makeMarkers, makeCutRule, makePasteRule } from 'restream'
import { debuglog } from 'util'
import { join, resolve } from 'path'
import { homedir } from 'os'
import {
  createTocRule, commentRule as stripComments, codeRe, innerCodeRe, linkTitleRe, linkRe,
} from './rules'
import tableRule, { tableRe } from './rules/table'
import methodTitleRule, { methodTitleRe } from './rules/method-title'
import treeRule from './rules/tree'
import exampleRule from './rules/example'
import forkRule from './rules/fork'
import { getLink } from '.'
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
 * @param {string} [options.toc] The table of contents to replace the `%TOC%` marker with.
   */
  constructor(options = {}) {
    const {
      toc, locations = {}, types: allTypes = [],
      cwd = '.',
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
  }
  get innerCode() {
    return this._innerCode
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
