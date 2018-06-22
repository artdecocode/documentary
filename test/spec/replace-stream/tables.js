import SnapshotContext from 'snapshot-context'
import Context from '../../context'
import createReplaceStream from '../../../src/lib/replace-stream'

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
    await test('tables.md', res)
  },
  async 'replaces multiple tables correctly'(
    { SNAPSHOT_DIR, createReadable, catchment, table }, { setDir, test },
  ) {
    setDir(SNAPSHOT_DIR)
    const rs = createReadable(`${table}\n${table}`)
    const s = createReplaceStream()
    rs.pipe(s)
    const res = await catchment(s)
    await test('tables-multiple.md', res)
  },
  async 'replaces tables if there are followed by code blocks'(
    { SNAPSHOT_DIR, createReadable, catchment, table, codeBlock }, { setDir, test },
  ) {
    setDir(SNAPSHOT_DIR)
    const rs = createReadable(`${table}\n${codeBlock}`)
    const s = createReplaceStream()
    rs.pipe(s)
    const res = await catchment(s)
    await test('tables-code.md', res)
  },
  // async 'writes short tables'(
  //   { SNAPSHOT_DIR, createReadable, catchment }, { setDir, test },
  // ) {
  //   setDir(SNAPSHOT_DIR)
  //   const rs = createReadable('```table [["hello", "world"], ["test", "data"]]```')
  //   const s = createReplaceStream()
  //   rs.pipe(s)
  //   const res = await catchment(s)
  //   await test('replace-stream/tables/short.md', res)
  // },
}

export default T
