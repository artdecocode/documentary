import { deepEqual } from '@zoroaster/assert'
import Context from '../../context'
import { tableRe } from '../../../src/lib/rules/table'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  async 'matches a table with a macro'({ mismatch }) {
    const c = `\`\`\`table MACRO
["hello", "world"]
\`\`\``
    const s = mismatch(tableRe, c, ['macro', 'content'])
    deepEqual(s, [
      { macro: 'MACRO', content: '["hello", "world"]' },
    ])
  },
  async 'matches a table without a macro'({ mismatch }) {
    const c = `\`\`\`table
["hello", "world"]
\`\`\``
    const s = mismatch(tableRe, c, ['macro', 'content'])
    deepEqual(s, [
      { content: '["hello", "world"]' },
    ])
  },
  async 'matches multiple tables'({ mismatch }) {
    const c = `\`\`\`table MACRO
["hello", "world"]
\`\`\`
\`\`\`table
["hello", "world"]
\`\`\``
    const s = mismatch(tableRe, c, ['macro', 'content'])
    deepEqual(s, [
      { macro: 'MACRO', content: '["hello", "world"]' },
      { content: '["hello", "world"]' },
    ])
  },
}

export default T
