import { Replaceable } from 'restream'
import { badgeRule, createTocRule, commentRule as stripComments, codeRe, innerCodeRe } from './rules'
import tableRule, { tableRe } from './rules/table'
import methodTitleRule, { methodTitleRe } from './rules/method-title'
import treeRule from './rules/tree'
import exampleRule from './rules/example'
import { makeRule, makeInitialRule, makeMarkers } from './markers'
import forkRule from './rules/fork'

export default function createReplaceStream(toc) {
  const tocRule = createTocRule(toc)

  const {
    table, methodTitle, code, innerCode,
  } = makeMarkers({
    table: tableRe,
    methodTitle: methodTitleRe,
    code: codeRe,
    innerCode: innerCodeRe,
  })

  const [cutCode, cutTable, cutMethodTitle, cutInnerCode] =
    [code, table, methodTitle, innerCode].map((marker) => {
      const rule = makeInitialRule(marker)
      return rule
    })
  const [insertCode, insertTable, insertMethodTitle, insertInnerCode] =
    [code, table, methodTitle, innerCode].map((marker) => {
      const rule = makeRule(marker)
      return rule
    })

  const s = new Replaceable([
    cutTable,
    cutMethodTitle,
    cutCode,
    cutInnerCode,
    stripComments,
    badgeRule,
    treeRule,
    exampleRule,
    forkRule,
    tocRule,

    insertTable,
    tableRule,
    insertMethodTitle,
    methodTitleRule,

    insertInnerCode,
    insertCode,
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
