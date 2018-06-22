import { Replaceable } from 'restream'
import { badgeRule, createTocRule, commentRule as stripComments, codeRe, innerCodeRe, linkTitleRe } from './rules'
import tableRule, { tableRe } from './rules/table'
import methodTitleRule, { methodTitleRe } from './rules/method-title'
import treeRule from './rules/tree'
import exampleRule from './rules/example'
import { makeRule, makeInitialRule, makeMarkers } from './markers'
import forkRule from './rules/fork'
import { getLink } from '.'

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

  const [cutCode, cutTable, cutMethodTitle, cutInnerCode, cutLinkTitle] =
    [code, table, methodTitle, innerCode, linkTitle].map((marker) => {
      const rule = makeInitialRule(marker)
      return rule
    })
  const [insertCode, insertTable, insertMethodTitle, insertInnerCode, insertLinkTitle] =
    [code, table, methodTitle, innerCode, linkTitle].map((marker) => {
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
    {
      re: linkTitleRe,
      replacement(match, title) {
        const ic = innerCode.regExp.exec(title)
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
