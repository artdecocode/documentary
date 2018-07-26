import SnapshotContext from 'snapshot-context'
import Context from '../../context'

/** @type {Object.<string, (c: Context, s: SnapshotContext )>} */
const T = {
  context: [
    Context,
    SnapshotContext,
  ],
  async 'replaces a type'(
    { createReadable, catchment, type, SNAPSHOT_DIR, replaceStream }, { setDir, test }
  ) {
    setDir(SNAPSHOT_DIR)
    const s = `%TYPE
${type}
%`
    const rs = createReadable(s)
    rs.pipe(replaceStream)
    const res = await catchment(replaceStream)
    await test('replace-stream/type.txt', res)
  },
  async 'replaces a type for toc headings'(
    { createReadable, catchment, type, SNAPSHOT_DIR, replaceStream }, { setDir, test }
  ) {
    setDir(SNAPSHOT_DIR)
    const s = `%TYPE true
${type}
%`
    const rs = createReadable(s)
    rs.pipe(replaceStream)
    const res = await catchment(replaceStream)
    await test('replace-stream/type-headings.txt', res)
  },
  async 'produces an example row'(
    { createReadable, catchment, SNAPSHOT_DIR, replaceStream }, { setDir, test }
  ) {
    setDir(SNAPSHOT_DIR)
    const s = `%TYPE
<p name="body" type="string|object|Buffer">
  <d>The return from the server.</d>
  <e>OK</e>
</p>
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
    rs.pipe(replaceStream)
    const res = await catchment(replaceStream)
    await test('replace-stream/type-example-row.txt', res)
  },
  async 'produces an example row with colspan 3'(
    { createReadable, catchment, SNAPSHOT_DIR, replaceStream }, { setDir, test }
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
    rs.pipe(replaceStream)
    const res = await catchment(replaceStream)
    await test('replace-stream/type-example-row-3.txt', res)
  },
  async 'does not add example header when no examples are found'(
    { createReadable, catchment, SNAPSHOT_DIR, replaceStream }, { setDir, test }
  ) {
    setDir(SNAPSHOT_DIR)
    const s = `%TYPE
<p name="headers" type="object">
  <d>Incoming headers returned by the server.</d>
</p>
<p name="status" type="string">
  <d>The status code.</d>
</p>
%`
    const rs = createReadable(s)
    rs.pipe(replaceStream)
    const res = await catchment(replaceStream)
    await test('replace-stream/type-no-examples.txt', res)
  },
}

export default T
