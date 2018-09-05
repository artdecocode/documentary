import { resolve } from 'path'
import makeRuleTestSuite from '../../make-rule-ts'
import rule from '../../../src/lib/rules/example'

const path = resolve(__dirname, '../../mask/example/replace.md')

const ts = makeRuleTestSuite(path, rule)

export default ts