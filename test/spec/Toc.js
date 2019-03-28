import Context, { MarkdownSnapshot } from '../context'
import Toc from '../../src/lib/Toc'
import { getStream } from '../../src/lib'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: [Context, MarkdownSnapshot],
  async 'reads TOC'({ README_PATH, Documentary }) {
    const documentary = new Documentary({ noCache: true })
    const toc = new Toc({ documentary })
    const rs = getStream(README_PATH)
    return rs.pipe(documentary).pipe(toc)
  },
}

export default T