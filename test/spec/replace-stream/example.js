import SnapshotContext from 'snapshot-context'
import Context from '../../context'
import createReplaceStream from '../../../src/lib/replace-stream'

/** @type {Object.<string, (c: Context, s: SnapshotContext )>} */
const T = {
  context: [
    Context,
    SnapshotContext,
  ],
  async 'gives an example'(
    { createReadable, catchment, EXAMPLE_PATH, SNAPSHOT_DIR }, { setDir, test }
  ) {
    setDir(SNAPSHOT_DIR)
    const s = `
For example, the program below will insert an example:

%EXAMPLE: ${EXAMPLE_PATH}%
`
    const rs = createReadable(s)
    const stream = createReplaceStream()
    rs.pipe(stream)
    const res = await catchment(stream)
    await test('replace-stream/example/index.md', res)
  },
  async 'gives a partial example'(
    { createReadable, catchment, PARTIAL_EXAMPLE_PATH, SNAPSHOT_DIR }, { setDir, test }
  ) {
    setDir(SNAPSHOT_DIR)
    const s = `
For example, the program below will insert an example:

%EXAMPLE: ${PARTIAL_EXAMPLE_PATH}%
`
    const rs = createReadable(s)
    const stream = createReplaceStream()
    rs.pipe(stream)
    const res = await catchment(stream)
    await test('replace-stream/example/start-end.md', res)
  },
  async 'gives an example and replaces the path'(
    { createReadable, catchment, EXAMPLE_PATH, SNAPSHOT_DIR }, { setDir, test }
  ) {
    setDir(SNAPSHOT_DIR)
    const s = `
For example, the program below will insert an example:

%EXAMPLE: ${EXAMPLE_PATH}, ../src => example%
`
    const rs = createReadable(s)
    const stream = createReplaceStream()
    rs.pipe(stream)
    const res = await catchment(stream)
    await test('replace-stream/example/path.md', res)
  },
}

export default T
