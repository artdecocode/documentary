import makeTestSuite from '@zoroaster/mask'
import { Replaceable } from 'restream'
import sectionBrakeRule from '../../src/lib/rules/section-break'
import badgeRule from '../../src/lib/rules/badge'
import exampleRule from '../../src/lib/rules/example'
import forkRule from '../../src/lib/rules/fork'
import tableRule from '../../src/lib/rules/table'
import tableMacroRule from '../../src/lib/rules/macro'
import { macroRule, useMacroRule } from '../../src/lib/rules/macros'

const ts = [
  [sectionBrakeRule, 'section break', 'section-break'],
  [badgeRule, 'badge', 'badge.md'],
  [exampleRule, 'example', 'example/default.md'],
  [forkRule, 'fork', 'fork/stderr.md'],
  [[tableMacroRule, tableRule], 'table', 'table'],
  [[macroRule, useMacroRule], 'macro', 'macro'],
].reduce((acc, [rule, name, path]) => {
  const focus = path.startsWith('!')
  if (focus) path = path.slice(1)
  let p = `${focus?'!':''}test/result/replacement/${path}`
  const t = makeTestSuite(p, {
    getTransform() {
      const replaceable = new Replaceable(rule)
      replaceable.getCache = () => {}
      replaceable.addCache = () => {}
      replaceable._args = this.preamble || {}
      replaceable.log = () => {}
      replaceable.addAsset = () => {}
      return replaceable
    },
    jsProps: ['preamble'],
  })
  return {
    ...acc,
    [name]: t,
  }
}, {})

export default ts