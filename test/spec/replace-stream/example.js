import Context, { MarkdownSnapshot } from '../../context'
import createReplaceStream from '../../../src/lib/replace-stream'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: [Context, MarkdownSnapshot],
  async 'gives an example'({ createReadable, EXAMPLE_PATH }) {
    const s = `
For example, the program below will insert an example:

%EXAMPLE: ${EXAMPLE_PATH}%
`
    const rs = createReadable(s)
    const stream = createReplaceStream()
    rs.pipe(stream)
    return stream
  },
  async 'gives a partial example'({ createReadable, PARTIAL_EXAMPLE_PATH }) {
    const s = `
For example, the program below will insert an example:

%EXAMPLE: ${PARTIAL_EXAMPLE_PATH}%
`
    const rs = createReadable(s)
    const stream = createReplaceStream()
    rs.pipe(stream)
    return stream
  },
  async 'gives an example and replaces the path'({ createReadable, EXAMPLE_PATH }) {
    const s = `
For example, the program below will insert an example:

%EXAMPLE: ${EXAMPLE_PATH}, ../src => example%
`
    const rs = createReadable(s)
    const stream = createReplaceStream()
    rs.pipe(stream)
    return stream
  },
}

export default T