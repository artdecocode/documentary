import { equal } from 'zoroaster/assert'
import Context from '../context'
import SnapshotContext from 'snapshot-context'
import { createReadStream } from 'fs'
import Toc from '../../src/lib/Toc'

/** @type {Object.<string, (c: Context, s: SnapshotContext )>} */
const T = {
  context: [
    Context,
    SnapshotContext,
  ],
  async 'reads TOC'({ SNAPSHOT_DIR, README_PATH, catchment }, { setDir, test }) {
    setDir(SNAPSHOT_DIR)
    const toc = new Toc()
    const rs = createReadStream(README_PATH)
    rs.pipe(toc)
    const res = await catchment(toc)
    await test('bin/toc.md', res)
  },
  async 'does not generate titles for 4-backtick escaped blocks'({
    createReadable, escapeBackticks, getRawMethodTitle, catchment,
  }) {
    const methodTitle = getRawMethodTitle()
    const s = escapeBackticks(methodTitle)
    const rs = createReadable(s)
    const toc = new Toc()
    rs.pipe(toc)
    const res = await catchment(toc)
    equal(res, '')
  },
  async 'does not generate titles for titles in comments'({
    createReadable, getComment, catchment,
  }) {
    const t = '\n## Hello World\n'
    const s = getComment(t)
    const rs = createReadable(s)
    const toc = new Toc()
    rs.pipe(toc)
    const res = await catchment(toc)
    equal(res, '')
  },
  async 'supports titles'({
    createReadable, catchment, SNAPSHOT_DIR,
  }, { setDir, test }) {
    setDir(SNAPSHOT_DIR)
    const title = 'Toc Title'
    const t = `## Title\n Something's going on here. \n Hello this is a [${title}](t).`
    const rs = createReadable(t)
    const toc = new Toc()
    rs.pipe(toc)
    const res = await catchment(toc)
    await test('toc/titles.md', res)
  },
  async 'supports titles with explicit level'({
    createReadable, catchment, SNAPSHOT_DIR,
  }, { setDir, test }) {
    setDir(SNAPSHOT_DIR)
    const title = 'Toc Title'
    const t = `## Title\n Something's going on here. \n Hello this is a [${title}](##).`
    const rs = createReadable(t)
    const toc = new Toc()
    rs.pipe(toc)
    const res = await catchment(toc)
    await test('toc/titles-explicit.md', res)
  },
  async 'supports titles found in a table'(
    { createReadable, catchment, SNAPSHOT_DIR, makeTable }, { setDir, test },
  ){
    setDir(SNAPSHOT_DIR)
    const title = '`Toc Title`'
    const table = makeTable(
      ['hello `[no match](t)`', 'world'],
      [`[${title}](t)`, 'test'],
    )
    const rs = createReadable(`## \`Hello World\` 123${table}`)
    const toc = new Toc()
    rs.pipe(toc)
    const res = await catchment(toc)
    await test('toc/titles-table.md', res)
  },
}

export default T
