import { equal } from 'zoroaster/assert'
import Context from '../context'
import SnapshotContext from 'snapshot-context'
import { createReadStream } from 'fs'
import createReplaceStream from '../../src/lib/replace-stream'

/** @type {Object.<string, (c: Context, s: SnapshotContext )>} */
const T = {
  context: [
    Context,
    SnapshotContext,
  ],
  async 'replaces tables correctly'(
    { SNAPSHOT_DIR, createReadable, catchment, table }, { setDir, test },
  ) {
    setDir(SNAPSHOT_DIR)
    const rs = createReadable(table)
    const s = createReplaceStream()
    rs.pipe(s)
    const res = await catchment(s)
    await test('tables.md', res.trim())
  },
  async 'replaces multiple tables correctly'(
    { SNAPSHOT_DIR, createReadable, catchment, table }, { setDir, test },
  ) {
    setDir(SNAPSHOT_DIR)
    const rs = createReadable(`${table}\n${table}`)
    const s = createReplaceStream()
    rs.pipe(s)
    const res = await catchment(s)
    await test('tables-multiple.md', res.trim())
  },
  async 'replaces tables if there are code blocks'(
    { SNAPSHOT_DIR, createReadable, catchment, table, codeBlock }, { setDir, test },
  ) {
    setDir(SNAPSHOT_DIR)
    const rs = createReadable(`${table}\n${codeBlock}`)
    const s = createReplaceStream()
    rs.pipe(s)
    const res = await catchment(s)
    await test('tables-code.md', res.trim())
  },
  async 'removes comments'({
    SNAPSHOT_DIR, createReadable, catchment, comment }, { setDir, test },
  ) {
    setDir(SNAPSHOT_DIR)
    const t = 'The program will perform the necessary operations.'
    const rs = createReadable(`${t}\n${comment}`)
    const s = createReplaceStream()
    rs.pipe(s)
    const res = await catchment(s)
    await test('comments-strip.md', res.trim())
  },
  async 'runs against fixture'({
    SNAPSHOT_DIR, README_PATH, catchment }, { setDir, test },
  ) {
    setDir(SNAPSHOT_DIR)
    const rs = createReadStream(README_PATH)
    const s = createReplaceStream()
    rs.pipe(s)
    const res = await catchment(s)
    await test('lib/replace-fixture.md', res.trim())
  },
  async 'keeps 4 back-ticks as a table code block'(
    { createReadable, catchment, rawTable, escapeBackticks }
  ) {
    const s = escapeBackticks(rawTable)
    const rs = createReadable(s)
    const stream = createReplaceStream()
    rs.pipe(stream)
    const res = await catchment(stream)
    equal(res, s)
  },
  async 'keeps 4 back-ticks as a method title'(
    { createReadable, getRawMethodTitle, catchment, escapeBackticks }
  ) {
    const methodTitle = getRawMethodTitle()
    const s = escapeBackticks(methodTitle)
    const rs = createReadable(s)
    const stream = createReplaceStream()
    rs.pipe(stream)
    const res = await catchment(stream)
    equal(res, s)
  },
}

export default T
