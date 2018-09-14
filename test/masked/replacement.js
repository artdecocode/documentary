import makeRule from '../make-rule-ts'
import sectionBrakeRule from '../../src/lib/rules/section-brake'

const sectionBrake = makeRule(
  'test/mask/replacement/section-brake.md', sectionBrakeRule,
)

export { sectionBrake }
