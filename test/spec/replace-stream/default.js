import { createReadStream } from 'fs'
import Context, { MarkdownSnapshot } from '../../context'
import createReplaceStream from '../../../src/lib/replace-stream'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: [Context, MarkdownSnapshot],
  async 'runs against fixture'({ README_PATH }) {
    const rs = createReadStream(README_PATH)
    const s = createReplaceStream()
    rs.pipe(s)
    return s
  },
}

export default T
