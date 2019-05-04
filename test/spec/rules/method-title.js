import { equal } from '@zoroaster/assert'
import { Replaceable } from 'restream'
import Context, { MarkdownSnapshot } from '../../context'
import titleRule, { replacer } from '../../../src/lib/rules/method-title'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: [Context, MarkdownSnapshot],
  async 'replaces the title'({ innerTitle }) {
    const a = 'async'
    const title = 'runSoftware'
    const ret = 'string'
    const level = '###'
    const res = replacer('', level, a, title, ret, innerTitle)
    return res.trim()
  },
  async 'replaces async function'({ getTitle, createReadable }) {
    const t = getTitle()
    const r = createReadable(t)
    const rs = new Replaceable(titleRule)
    return r.pipe(rs)
  },
  async 'replaces function without return'({ getTitle, createReadable }) {
    const t = getTitle(true, true, false)
    const r = createReadable(t)
    const rs = new Replaceable(titleRule)
    return r.pipe(rs)
  },
  async 'replaces non-async function'({ getTitle, createReadable }) {
    const t = getTitle(false)
    const r = createReadable(t)
    const rs = new Replaceable(titleRule)
    return r.pipe(rs)
  },
  async 'replaces single line function'({ getTitle, createReadable }) {
    const t = getTitle(false, false)
    const r = createReadable(t)
    const rs = new Replaceable(titleRule)
    return r.pipe(rs)
  },
  async 'returns match when cannot parse the table'() {
    const m = '### async run => string'
    const res = replacer(m, '###', 'async', 'run', 'string', 'invalid')
    equal(res, m)
  },
}

export default T
