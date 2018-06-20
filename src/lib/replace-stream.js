import { Replaceable } from 'restream'
import { badgeRule, createTocRule, commentRule } from './rules'
import tableRule from './rules/table'
import titleRule from './rules/method-title'
import exampleRule from './rules/example'

export default function createReplaceStream(toc) {
  const tocRule = createTocRule(toc)

  const s = new Replaceable([
    commentRule,
    tocRule,
    badgeRule,
    tableRule,
    titleRule,
    exampleRule,
  ])

  return s
}
