import { ok, equal } from 'zoroaster/assert'
import SnapshotContext from 'snapshot-context'
import Context from '../../context'
import { tableRe } from '../../../src/lib/rules/table'
import { linkTitleRe } from '../../../src/lib/rules'

/** @type {Object.<string, (c: Context, s: SnapshotContext )>} */
const T = {
  context: [
    Context,
    SnapshotContext,
  ],
  async 'matches the table with the re'({ table, cloneRe }) {
    const re = cloneRe(tableRe)
    const res = re.test(table)
    ok(res)
  },
  async 'detects link titles'({ getMatches }) {
    const s = '[Hello World](t)'
    const { title, t } = getMatches(s, linkTitleRe, ['title', 't'])
    equal(title, 'Hello World')
    equal(t, 't')
  },
  async 'detects link titles with a level'({ getMatches }) {
    const s = '[Hello World](###)'
    const { title, t } = getMatches(s, linkTitleRe, ['title', 't'])
    equal(title, 'Hello World')
    equal(t, '###')
  },
}

export default T
