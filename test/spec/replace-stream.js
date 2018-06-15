import Context from '../context'
import SnapshotContext from 'snapshot-context'
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
  async 'adds TOC'(
    { SNAPSHOT_DIR, createReadable, catchment }, { setDir, test },
  ) {
    setDir(SNAPSHOT_DIR)
    const toc = '## Table of Contents\n### Hello World'
    const t = 'The program will perform the necessary operations.'
    const rs = createReadable(`${t}\n%TOC%`)
    const s = createReplaceStream(toc)
    rs.pipe(s)
    const res = await catchment(s)
    await test('add-toc.md', res.trim())
  },
}

export default T
