import { equal } from '@zoroaster/assert'
import Context, { MarkdownSnapshot } from '../../context'
import titleRule, { replacer } from '../../../src/lib/rules/method-title'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: [Context, MarkdownSnapshot],
  async 'replaces the title'({ innerTitle, DocumentaryNoDToc }) {
    const a = 'async'
    const title = 'runSoftware'
    const ret = 'string'
    const level = '###'
    const res = replacer.call(DocumentaryNoDToc, '', level, a, title, ret, innerTitle)
    return res.trim()
  },
  async 'replaces async function'({ getTitle, createReadable, mockDoc }) {
    const t = getTitle()
    const r = createReadable(t, false)
    return r.pipe(mockDoc(titleRule))
  },
  async 'replaces function without return'({ getTitle, createReadable, mockDoc }) {
    const t = getTitle(true, true, false)
    const r = createReadable(t, false)
    return r.pipe(mockDoc(titleRule))
  },
  async 'replaces non-async function'({ getTitle, createReadable, mockDoc }) {
    const t = getTitle(false)
    const r = createReadable(t, false)
    return r.pipe(mockDoc(titleRule))
  },
  async 'replaces single line function'({ getTitle, createReadable, mockDoc }) {
    const t = getTitle(false, false)
    const r = createReadable(t, false)
    return r.pipe(mockDoc(titleRule))
  },
  async 'returns match when cannot parse the table'({ DocumentaryNoDToc }) {
    const m = '### async run => string'
    const res = replacer.call(DocumentaryNoDToc, m, '###', 'async', 'run', 'string', 'invalid')
    equal(res, m)
  },
}

export default T
