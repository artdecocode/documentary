import { makeTestSuite } from 'zoroaster'
import { Replaceable } from 'restream'
import sectionBrakeRule from '../../src/lib/rules/section-break'
import badgeRule from '../../src/lib/rules/badge'
import exampleRule from '../../src/lib/rules/example'
import forkRule from '../../src/lib/rules/fork'
import tableRule from '../../src/lib/rules/table'
import tableMacroRule from '../../src/lib/rules/macro'
// import typedefMdRule from '../../src/lib/rules/typedef-md'

const ts = [
  [sectionBrakeRule, 'section break', 'section-break.md'],
  [badgeRule, 'badge', 'badge.md'],
  [exampleRule, 'example', 'example'],
  [forkRule, 'fork', 'fork'],
  [[tableMacroRule, tableRule], 'table', 'table'],
  // [typedefMdRule, '!typedef', 'typedef'],
].reduce((acc, [rule, name, path]) => {
  const p = `test/result/replacement/${path}`
  const t = makeTestSuite(p, {
    streamResult() {
      const replaceable = new Replaceable(rule)
      return replaceable
    },
  })
  return {
    ...acc,
    [name]: t,
  }
}, {})

export default ts