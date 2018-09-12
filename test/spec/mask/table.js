import { resolve } from 'path'
import makeRuleTestSuite from '../../make-rule-ts'
import macroRule from '../../../src/lib/rules/macro'
import tableRule from '../../../src/lib/rules/table'

const path = resolve(__dirname, '../../mask/table/index.md')

const ts = makeRuleTestSuite(path, [macroRule, tableRule])

export default ts