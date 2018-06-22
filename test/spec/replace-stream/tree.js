import { equal } from 'zoroaster/assert'
import SnapshotContext from 'snapshot-context'
import Context from '../../context'
import createReplaceStream from '../../../src/lib/replace-stream'

/** @type {Object.<string, (c: Context, s: SnapshotContext )>} */
const T = {
  context: [
    Context,
    SnapshotContext,
  ],
  async 'replaces a tree'(
    { createReadable, catchment, readme_path, SNAPSHOT_DIR }, { setDir, test }
  ) {
    setDir(SNAPSHOT_DIR)
    const s = `
Below is the directory structure:

%TREE ${readme_path} -a%
`
    const rs = createReadable(s)
    const stream = createReplaceStream()
    rs.pipe(stream)
    const res = await catchment(stream)
    await test('replace-stream/tree.txt', res.trim())
  },
  async 'does not replace a tree when file not found'(
    { createReadable, catchment }
  ) {
    const s = `
Below is the directory structure:

%TREE unknown_file%
`
    const rs = createReadable(s)
    const stream = createReplaceStream()
    rs.pipe(stream)
    const res = await catchment(stream, true)
    equal(res, s)
  },
}

export default T
