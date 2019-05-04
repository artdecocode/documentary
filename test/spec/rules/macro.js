import { equal, deepEqual } from '@zoroaster/assert'
import Context from '../../context'
import rule from '../../../src/lib/rules/macro'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: [
    Context,
  ],
  async 'creates a function to replace rows'({ replace }) {
    const s = `%TABLE-MACRO Company
test-$1, test-$2
%

%TABLE-MACRO Company2
test2-$1, test2-$2
%

%TABLE-MACRO Company3
test3-$1\\, test3-$1, test3-$2\\, test3-$2
%`
    const { res, replaceable: { tableMacros } } = await replace(rule, s)
    equal(res, '\n\n')
    deepEqual(
      Object.keys(tableMacros),
      ['Company', 'Company2', 'Company3'],
    )
    const vals = ['hello', 'world']
    const { Company, Company2, Company3 } = tableMacros
    const res1 = Company(vals)
    deepEqual(res1, ['test-hello', 'test-world'])
    const res2 = Company2(vals)
    deepEqual(res2, ['test2-hello', 'test2-world'])
    const res3 = Company3(vals)
    deepEqual(res3,
      ['test3-hello, test3-hello', 'test3-world, test3-world'],
    )
  },
}

export default T
