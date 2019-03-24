import Context, { MarkdownSnapshot } from '../../context'
import createJsReplaceStream from '../../../src/lib/js-replace-stream'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: [Context, MarkdownSnapshot],
  async 'places types declaration'({ createReadable, typesLocation }) {
    const s = `/* documentary ${typesLocation} */

`
    const rs = createReadable(s)
    const stream = createJsReplaceStream()
    rs.pipe(stream)
    return stream
  },
  async 'places types declaration with existing typedef'({ createReadable, typesLocation }) {
    const s = `/* documentary ${typesLocation} */

/**
 * @typedef {Object} TypeDef Existing typedef.
 * @prop {string} [test=true] If test or not.
 */

export default test`
    const rs = createReadable(s)
    const stream = createJsReplaceStream()
    rs.pipe(stream)
    return stream
  },
}

export default T
