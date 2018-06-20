import { equal } from 'zoroaster/assert'
import SnapshotContext from 'snapshot-context'
import { Replaceable } from 'restream'
import Context from '../../context'
import titleRule, { replacer } from '../../../src/lib/rules/method-title'

/** @type {Object.<string, (c: Context, s: SnapshotContext)>} */
const T = {
  context: [
    Context,
    SnapshotContext,
  ],
  async 'replaces the title'({ innerTitle, SNAPSHOT_DIR }, { setDir, test }) {
    setDir(SNAPSHOT_DIR)
    const a = 'async'
    const title = 'runSoftware'
    const ret = 'string'
    const level = '###'
    const res = replacer('', level, a, title, ret, innerTitle)
    await test('lib/replacer.md', res.trim())
  },
  async 'replaces async function'(
    { getTitle, createReadable, catchment, SNAPSHOT_DIR }, { setDir, test },
  ) {
    setDir(SNAPSHOT_DIR)
    const t = getTitle()
    const r = createReadable(t)
    const rs = new Replaceable(titleRule)
    r.pipe(rs)
    const res = await catchment(rs)
    await test('method-title/async-return.md', res)
  },
  async 'replaces function without return'(
    { getTitle, createReadable, catchment, SNAPSHOT_DIR }, { setDir, test },
  ) {
    setDir(SNAPSHOT_DIR)
    const t = getTitle(true, true, false)
    const r = createReadable(t)
    const rs = new Replaceable(titleRule)
    r.pipe(rs)
    const res = await catchment(rs)
    await test('method-title/async.md', res)
  },
  async 'replaces non-async function'(
    { getTitle, createReadable, catchment, SNAPSHOT_DIR }, { setDir, test },
  ) {
    setDir(SNAPSHOT_DIR)
    const t = getTitle(false)
    const r = createReadable(t)
    const rs = new Replaceable(titleRule)
    r.pipe(rs)
    const res = await catchment(rs)
    await test('method-title/return.md', res)
  },
  async 'replaces single line function'(
    { getTitle, createReadable, catchment, SNAPSHOT_DIR }, { setDir, test },
  ) {
    setDir(SNAPSHOT_DIR)
    const t = getTitle(false, false)
    const r = createReadable(t)
    const rs = new Replaceable(titleRule)
    r.pipe(rs)
    const res = await catchment(rs)
    await test('method-title/single-line.md', res)
  },
  async 'returns match when cannot parse the table'() {
    const m = '### async run => string'
    const res = replacer(m, '###', 'async', 'run', 'string', 'invalid')
    equal(res, m)
  },
}

export default T
