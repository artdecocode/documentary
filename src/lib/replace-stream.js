import { Replaceable } from 'restream'
import { badgeRule, createTocRule, commentRule, codeRe } from './rules'
import tableRule from './rules/table'
import titleRule from './rules/method-title'
import exampleRule from './rules/example'

const makeARegex = (rule) => {
  const re = new RegExp(`^${rule.re.source}`)
  return re
}

const ttableRule = makeARegex(tableRule)
const ttileRule = makeARegex(titleRule)
export default function createReplaceStream(toc) {
  const tocRule = createTocRule(toc)

  const codeBlocks = []
  const marker = `%%_DOCUMENTARY_REPLACEMENT_${Date.now()}_%%`
  const s = new Replaceable([
    commentRule,
    {
      re: new RegExp(codeRe, 'g'),
      replacement(match) {
        if (ttableRule.test(match) || ttileRule.test(match)) {
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
