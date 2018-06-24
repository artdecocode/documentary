import SnapshotContext from 'snapshot-context'
import Context from '../../context'
import createReplaceStream from '../../../src/lib/replace-stream'

/** @type {Object.<string, (c: Context, s: SnapshotContext )>} */
const T = {
  context: [
    Context,
    SnapshotContext,
  ],
  async 'inserts a <detail> block around an image'(
    { createReadable, catchment, SNAPSHOT_DIR }, { setDir, test }
  ) {
    setDir(SNAPSHOT_DIR)
    const s = `
Below is how the program runs on the CLI:

%GIF path/to/file.gif
Generating a readme file.
<code>doc README-source.md -o README.md</code>
%
`
    const rs = createReadable(s)
    const stream = createReplaceStream()
    rs.pipe(stream)
    const res = await catchment(stream)
    await test('replace-stream/gif.html', res)
  },
}

export default T
