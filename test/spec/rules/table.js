import { equal } from 'zoroaster/assert'
import SnapshotContext from 'snapshot-context'
import Context from '../../context'
import { replacer } from '../../../src/lib/rules/table'

/** @type {Object.<string, (c: Context, s: SnapshotContext)>} */
const T = {
  context: [
    Context,
    SnapshotContext,
  ],
  async 'replaces the table'({ innerTable, SNAPSHOT_DIR }, { setDir, test }) {
    setDir(SNAPSHOT_DIR)
    const res = replacer('', innerTable)
    await test('lib/replace-table.md', res.trim())
  },
  async 'returns match when cannot parse the table'() {
    const m = 'match with invalid table'
    const res = replacer(m, 'invalid table')
    equal(res, m)
  },
}

export default T
