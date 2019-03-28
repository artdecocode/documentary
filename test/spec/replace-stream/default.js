import { createReadStream } from 'fs'
import Context, { MarkdownSnapshot } from '../../context'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: [Context, MarkdownSnapshot],
  async 'runs against fixture'({ README_PATH, Documentary }) {
    const rs = createReadStream(README_PATH)
    const s = new Documentary({
      disableDtoc: true,
    })
    return rs.pipe(s)
  },
}

export default T
