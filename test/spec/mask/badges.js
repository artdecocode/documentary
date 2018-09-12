import { resolve } from 'path'
import makeRuleTestSuite from '../../make-rule-ts'
import rule from '../../../src/lib/rules/badge'

const path = resolve(__dirname, '../../mask/badges/index.js')
const ts = makeRuleTestSuite(path, rule)


export default ts