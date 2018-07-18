import SnapshotContext from 'snapshot-context'
import Context from '../../context'
import createReplaceStream from '../../../src/lib/replace-stream'

/** @type {Object.<string, (c: Context, s: SnapshotContext )>} */
const T = {
  context: [
    Context,
    SnapshotContext,
  ],
  async 'replaces a type'(
    { createReadable, catchment, type, SNAPSHOT_DIR }, { setDir, test }
  ) {
    setDir(SNAPSHOT_DIR)
    const s = `%TYPE
${type}
%`
    const rs = createReadable(s)
    const stream = createReplaceStream()
    rs.pipe(stream)
    const res = await catchment(stream)
    await test('replace-stream/type.txt', res)
  },
  async 'replaces a type for toc headings'(
    { createReadable, catchment, type, SNAPSHOT_DIR }, { setDir, test }
  ) {
    setDir(SNAPSHOT_DIR)
    const s = `%TYPE true
${type}
%`
    const rs = createReadable(s)
    const stream = createReplaceStream()
    rs.pipe(stream)
    const res = await catchment(stream)
    await test('replace-stream/type-headings.txt', res)
  },
  async 'produces an example row'(
    { createReadable, catchment, SNAPSHOT_DIR }, { setDir, test }
  ) {
    setDir(SNAPSHOT_DIR)
    const s = `%TYPE
  <p name="headers" type="object">
  <d>Incoming headers returned by the server.</d>
  <e row><code>
{
  "server": "GitHub.com",
  "content-type": "application/json",
  "content-length": "2",
  "connection": "close",
  "status": "200 OK"
}
   </code></e>
</p>
%`
    const rs = createReadable(s)
    const stream = createReplaceStream()
    rs.pipe(stream)
    const res = await catchment(stream)
    await test('replace-stream/type-example-row.txt', res)
  },
}

export default T
