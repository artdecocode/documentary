import { Replaceable } from 'restream'
import { createTocRule, commentRule as stripComments, codeRe, innerCodeRe, linkTitleRe } from './rules'
import tableRule, { tableRe } from './rules/table'
import methodTitleRule, { methodTitleRe } from './rules/method-title'
import treeRule from './rules/tree'
import exampleRule from './rules/example'
import { makeRule, makeInitialRule, makeMarkers } from './markers'
import forkRule from './rules/fork'
import { getLink } from '.'
import gifRule from './rules/gif'
import typeRule from './rules/type'
import badgeRule from './rules/badge'

export default function createReplaceStream(toc) {
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

  const [cutCode, cutTable, cutMethodTitle, cutInnerCode] =
    [code, table, methodTitle, innerCode, linkTitle].map((marker) => {
      const rule = makeInitialRule(marker)
      return rule
    })
  const [insertCode, insertTable, insertMethodTitle, insertInnerCode] =
    [code, table, methodTitle, innerCode, linkTitle].map((marker) => {
      const rule = makeRule(marker)
      return rule
    })

  const s = new Replaceable([
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
    tableRule,
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
    insertMethodTitle,
    methodTitleRule,

    insertCode,
    insertInnerCode,
    // those found inside of code blocks
    insertTable,
    insertMethodTitle,
  ])

  return s
}

// {
//   re: /[\s\S]*/,
//   replacement(match) {
//     debugger
//     return match
//   },
// },
