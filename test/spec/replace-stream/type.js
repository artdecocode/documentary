import Context, { MarkdownSnapshot } from '../../context'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: [Context, MarkdownSnapshot],
  async 'replaces a type'({ createReadable, type, replaceStream }) {
    const s = `%TYPE
${type}
%`
    const rs = createReadable(s)
    rs.pipe(replaceStream)
    return replaceStream
  },
  async 'replaces a type for toc headings'({ createReadable, type, DocumentaryNoDToc }) {
    const s = `%TYPE true
${type}
%`
    const rs = createReadable(s)
    return rs.pipe(DocumentaryNoDToc)
  },
  async 'produces an example row'({ createReadable, replaceStream }) {
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
    return rs.pipe(replaceStream)
  },
  async 'produces an example row with colspan 3'({ createReadable, replaceStream }) {
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
    return replaceStream
  },
  async 'does not add example header when no examples are found'({ createReadable, replaceStream }) {
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
    return replaceStream
  },
}

export default T
