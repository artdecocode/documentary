import { equal } from 'zoroaster/assert'
import Context, { MarkdownSnapshot } from '../../context'
import createReplaceStream from '../../../src/lib/replace-stream'

/** @type {Object.<string, (c: Context )>} */
const T = {
  context: [Context, MarkdownSnapshot],
  async 'replaces a tree'(
    { createReadable, readme_path }) {
    const s = `
Below is the directory structure:

%TREE ${readme_path} -a%
`
    const rs = createReadable(s)
    const stream = createReplaceStream()
    rs.pipe(stream)
    return stream
  },
  async 'does not replace a tree when file not found'(
    { createReadable, catchment }
  ) {
    const s = `
Below is the directory structure:

%TREE unknown_file%
`
    const rs = createReadable(s)
    const stream = createReplaceStream()
    rs.pipe(stream)
    const res = await catchment(stream, true)
    equal(res, s)
  },
}

export default T
