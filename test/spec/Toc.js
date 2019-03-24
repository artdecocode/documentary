import Context, { MarkdownSnapshot } from '../context'
import { createReadStream } from 'fs'
import Toc from '../../src/lib/Toc'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: [Context, MarkdownSnapshot],
  async 'reads TOC'({ README_PATH, catchment }) {
    const toc = new Toc()
    const rs = createReadStream(README_PATH)
    rs.pipe(toc)
    const res = await catchment(toc)
    return res
  },
}

export default T
