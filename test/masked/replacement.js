import makeRule from '../make-rule-ts'
import sectionBrakeRule from '../../src/lib/rules/section-break'

const sectionBrake = makeRule(
  'test/mask/replacement/section-break.md', sectionBrakeRule,
)

export { sectionBrake }
