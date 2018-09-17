import { makeTestSuite } from 'zoroaster'
import { Replaceable } from 'restream'
import sectionBrakeRule from '../../src/lib/rules/section-break'
import badgeRule from '../../src/lib/rules/badge'
import exampleRule from '../../src/lib/rules/example'
import forkRule from '../../src/lib/rules/fork'
import tableRule from '../../src/lib/rules/table'
import tableMacroRule from '../../src/lib/rules/macro'

const ts = [
  [sectionBrakeRule, 'section break', 'section-break.md'],
  [badgeRule, 'badge', 'badge.md'],
  [exampleRule, 'example', 'example/index.md'],
  [forkRule, 'fork', 'fork/stderr.md'],
  [[tableMacroRule, tableRule], 'table', 'table'],
].reduce((acc, [rule, name, path]) => {
  const p = `test/result/replacement/${path}`
  const t = makeTestSuite(p, {
    getTransform() {
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