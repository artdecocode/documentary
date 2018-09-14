import makeRule from '../make-rule-rs'
import { sectionBrakeRe } from '../../src/lib/rules/section-brake'

const sectionBrake = makeRule(
  'test/mask/re/section-brake.md', sectionBrakeRe, ['number', 'attrs'],
)

export { sectionBrake }
