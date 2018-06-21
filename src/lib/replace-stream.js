import { Replaceable } from 'restream'
import { badgeRule, createTocRule, commentRule, codeRe } from './rules'
import { exactTable, exactMethodTitle } from '../lib'
import tableRule from './rules/table'
import titleRule from './rules/method-title'
import exampleRule from './rules/example'

export default function createReplaceStream(toc) {
  const tocRule = createTocRule(toc)

  const codeBlocks = []
  const marker = `%%_DOCUMENTARY_REPLACEMENT_${Date.now()}_%%`
  const s = new Replaceable([
    commentRule,
    {
      re: new RegExp(codeRe, 'g'),
      replacement(match) {
        if (exactTable.test(match) || exactMethodTitle.test(match)) {
          return match
        }
        codeBlocks.push(match)
        return marker
      },
    },
    tocRule,
    badgeRule,
    tableRule,
    titleRule,
    exampleRule,
    {
      re: new RegExp(marker, 'g'),
      replacement() {
        return codeBlocks.shift()
      },
    },
  ])

  return s
}
