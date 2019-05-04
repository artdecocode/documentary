import { deepEqual } from '@zoroaster/assert'
import Context from '../../context'
import { re } from '../../../src/lib/rules/macro'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  async 'matches a single macro'({ mismatch }) {
    const c = `%TABLE-MACRO Company
test, test
%`
    const s = mismatch(re, c, ['name', 'content'])
    deepEqual(s, [
      { name: 'Company', content: 'test, test' },
    ])
  },
  async 'matches multiple macros'({ mismatch }) {
    const c = `%TABLE-MACRO Company
test, test
%

%TABLE-MACRO Company2
test2, test2
%`
    const s = mismatch(re, c, ['name', 'content'])
    deepEqual(s, [
      { name: 'Company', content: 'test, test' },
      { name: 'Company2', content: 'test2, test2' },
    ])
  },
}

export default T
