import { Replaceable, makeMarkers, makeCutRule, makePasteRule } from 'restream'
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
import typedefMdRule from './rules/typedef-md'

export class DocumentationStream extends Replaceable {
  constructor({ toc }) {
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
      cutInnerCode,
      cutTable,
      cutMethodTitle,
      cutCode,
      stripComments,

      badgeRule,
      treeRule,
      exampleRule,
      forkRule,
      tocRule,
      gifRule,
      typeRule,

      insertTable,
      typedefMdRule, // places a table hence just before table
      tableRule,

      { // a hackish way to update types property tables to include links to seen types.
        re: /\| _(\w+)_ \|/g,
        replacement(match, name) {
          if (!(name in this.types)) return match
          return `| _[${name}](#${getLink(name)})_ |`
        },
      },
      {
        re: linkTitleRe,
        replacement(match, title) {
          const ic = new RegExp(innerCode.regExp.source).exec(title) // test please
          let link
          if (!ic) {
            link = getLink(title)
          } else {
            const [, i] = ic
            const val = innerCode.map[i]
            link = getLink(val)
          }
          return `<a name="${link}">${title}</a>`
        },
      },
      {
        re: linkRe, // make links
        replacement(match, title) {
          // check why is needed to use innerCode re above
          const link = getLink(title)
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

    this.on('types', types => {
      types.forEach(this.addType.bind(this))
    })
  }
  addType(name) {
    this.types[name] = true
  }
  get types() {
    return this._types
  }
}

export default function createReplaceStream(toc) {
  const s = new DocumentationStream({
    toc,
  })

  return s
}

// {
//   re: /[\s\S]*/,
//   replacement(match) {
//     debugger
//     return match
//   },
// },
