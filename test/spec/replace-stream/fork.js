import Context, { MarkdownSnapshot } from '../../context'
import createReplaceStream from '../../../src/lib/replace-stream'

/** @type {Object.<string, (c: Context )>} */
const T = {
  context: [Context, MarkdownSnapshot],
  async 'forks a node.js process'({ createReadable, FORK_PATH }) {
    const s = `
Below is the output of the program:

%FORK ${FORK_PATH}%
`
    const rs = createReadable(s)
    const stream = createReplaceStream()
    rs.pipe(stream)
    return stream
  },
  async 'forks a node.js process with language'({ createReadable, FORK_PATH }) {
    const s = `
Below is the output of the program:

%FORK-json ${FORK_PATH}%
`
    const rs = createReadable(s)
    const stream = createReplaceStream()
    rs.pipe(stream)
    return stream
  },
}

export default T
