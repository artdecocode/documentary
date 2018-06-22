import { Replaceable } from 'restream'
import { badgeRule, createTocRule, commentRule as stripComments, codeRe, innerCodeRe } from './rules'
import tableRule, { tableRe } from './rules/table'
import titleRule, { methodTitleRe } from './rules/method-title'
import treeRule from './rules/tree'
import exampleRule from './rules/example'
import { makeRule, makeInitialRule, makeMarkers } from './markers';

export default function createReplaceStream(toc) {
  const tocRule = createTocRule(toc)

  const {
    table, methodTitle, code, innerCode,
  } = makeMarkers({
    table: tableRe, // exactTable,
    methodTitle: methodTitleRe,
    code: codeRe,
    innerCode: innerCodeRe,
  })
  // exact table

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
    insertInnerCode,
    tocRule,
    badgeRule,
    exampleRule,
    treeRule,
    insertTable,
    insertMethodTitle,
    tableRule,
    titleRule,
    insertCode,
    // those found inside of code blocks
    insertTable,
    insertMethodTitle,
  ])

  return s
}

// const debugRule = {
//   re: /[\s\S]*/,
//   replacement(match) {
//     debugger
//     return match
//   },
// }
