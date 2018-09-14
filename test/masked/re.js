import makeRule from '../make-rule-rs'
import { sectionBrakeRe } from '../../src/lib/rules/section-break'

const sectionBrake = makeRule(
  'test/mask/re/section-break.md', sectionBrakeRe, ['number', 'attrs'],
)

export { sectionBrake }
