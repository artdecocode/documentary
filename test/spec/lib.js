import { throws, equal } from 'zoroaster/assert'
import SnapshotContext from 'snapshot-context'
import Context from '../context'
import { getLink, tableRule, titleReplacer, titleRule } from '../../src/lib'
import { replaceStream } from 'restream'

/** @type {Object.<string, (c: Context)>} */
export const GetLink = {
  context: Context,
  async 'strips the br tags and &nbsp;'() {
    const link = getLink('`koa2Jsx({`<br/>&nbsp;&nbsp;`reducer: function,`<br/>&nbsp;&nbsp;`View: Container,`<br/>&nbsp;&nbsp;`actions: object,`<br/>&nbsp;&nbsp;`static?: boolean = true,`<br/>&nbsp;&nbsp;`render?: function,`<br/>`}): function`')
    const message = 'koa2jsxreducer-functionview-containeractions-objectstatic-boolean--truerender-function-function'
    await throws({
      async fn() {
        throw new Error(link)
      },
      message,
    })
  },
}

/** @type {Object.<string, (c: Context, s: SnapshotContext)>} */
export const TableRule = {
  context: [
    Context,
    SnapshotContext,
  ],
  async 'replaces the table'({ innerTable, SNAPSHOT_DIR }, { setDir, test }) {
    setDir(SNAPSHOT_DIR)
    const res = tableRule('', innerTable)
    await test('lib/replace-table.md', res.trim())
  },
  async 'returns match when cannot parse the table'() {
    const m = 'match with invalid table'
    const res = tableRule(m, 'invalid table')
    equal(res, m)
  },
}

/** @type {Object.<string, (c: Context, s: SnapshotContext)>} */
export const TitleReplacer = {
  context: [
    Context,
    SnapshotContext,
  ],
  async 'replaces the title'({ innerTitle, SNAPSHOT_DIR }, { setDir, test }) {
    setDir(SNAPSHOT_DIR)
    const a = 'async'
    const title = 'runSoftware'
    const ret = 'string'
    const level = '###'
    const res = titleReplacer('', level, a, title, ret, innerTitle)
    await test('lib/replacer.md', res.trim())
  },
  async 'replaces async function'(
    { getTitle, createReadable, catchment, SNAPSHOT_DIR }, { setDir, test },
  ) {
    setDir(SNAPSHOT_DIR)
    const t = getTitle()
    const r = createReadable(t)
    const rs = replaceStream(titleRule)
    r.pipe(rs)
    const res = await catchment(rs)
    await test('method-title/async-return.md', res)
  },
  async 'replaces function without return'(
    { getTitle, createReadable, catchment, SNAPSHOT_DIR }, { setDir, test },
  ) {
    setDir(SNAPSHOT_DIR)
    const t = getTitle(true, true, false)
    const r = createReadable(t)
    const rs = replaceStream(titleRule)
    r.pipe(rs)
    const res = await catchment(rs)
    await test('method-title/async.md', res)
  },
  async 'replaces non-async function'(
    { getTitle, createReadable, catchment, SNAPSHOT_DIR }, { setDir, test },
  ) {
    setDir(SNAPSHOT_DIR)
    const t = getTitle(false)
    const r = createReadable(t)
    const rs = replaceStream(titleRule)
    r.pipe(rs)
    const res = await catchment(rs)
    await test('method-title/return.md', res)
  },
  async 'replaces single line function'(
    { getTitle, createReadable, catchment, SNAPSHOT_DIR }, { setDir, test },
  ) {
    setDir(SNAPSHOT_DIR)
    const t = getTitle(false, false)
    const r = createReadable(t)
    const rs = replaceStream(titleRule)
    r.pipe(rs)
    const res = await catchment(rs)
    await test('method-title/single-line.md', res)
  },
  async 'returns match when cannot parse the table'() {
    const m = '### async run => string'
    const res = titleReplacer(m, '###', 'async', 'run', 'string', 'invalid')
    equal(res, m)
  },
}
