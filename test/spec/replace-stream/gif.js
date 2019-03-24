import Context, { MarkdownSnapshot } from '../../context'
import createReplaceStream from '../../../src/lib/replace-stream'

/** @type {Object.<string, (c: Context )>} */
const T = {
  context: [Context, MarkdownSnapshot],
  async 'inserts a <detail> block around an image'({ createReadable }) {
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
    return stream
  },
}

export default T
