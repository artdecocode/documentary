import { resolve } from 'path'
import makeRuleTestSuite from '../../make-rule-ts'
import rule from '../../../src/lib/rules/fork'

const path = resolve(__dirname, '../../mask/fork/stderr.md')

const stderr = makeRuleTestSuite(path, rule)

export default { stderr }