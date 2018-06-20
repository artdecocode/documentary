import { ok, equal } from 'assert'
import { deepEqual } from 'zoroaster/assert'
import SnapshotContext from 'snapshot-context'
import { Replaceable } from 'restream'
import Context from '../../context'
import exampleRule, { re } from '../../../src/lib/rules/example'

/** @type {Object.<string, (c: Context, s: SnapshotContext)>} */
const T = {
  context: [
    Context,
    SnapshotContext,
  ],
  'matches a single argument'({ examplePath }) {
    const res = re.exec(`%EXAMPLE: ${examplePath}%`)
    ok(res)
    const [, ...a] = res
    deepEqual(a, [examplePath, undefined, undefined, undefined])
  },
  'matches 2 arguments'({ examplePath, resetRe }) {
    const from = '../src'
    const to = 'documentary'
    const r = `${from} => ${to}`
    const s = `%EXAMPLE: ${examplePath}, ${r}%`
    resetRe(re)
    const res = re.exec(s)
    ok(res)
    const [, ...a] = res
    deepEqual(a, [examplePath, from, to, undefined])
  },
  'matches 2 arguments without replacement'({ examplePath, resetRe }) {
    const type = 'js'
    const s = `%EXAMPLE: ${examplePath}, ${type}%`
    resetRe(re)
    const res = re.exec(s)
    ok(res)
    const [, ...a] = res
    deepEqual(a, [examplePath, undefined, undefined, type])
  },
  'matches 3 arguments'({ examplePath, resetRe }) {
    const from = '../src'
    const to = 'documentary'
    const r = `${from} => ${to}`
    const type = 'js'
    const s = `%EXAMPLE: ${examplePath}, ${r}, ${type}%`
    resetRe(re)
    const res = re.exec(s)
    ok(res)
    const [, ...a] = res
    deepEqual(a, [examplePath, from, to, type])
  },
  async 'replaces an example without replacement'(
    { createReadable, catchment, SNAPSHOT_DIR, examplePath }, { setDir, test },
  ) {
    setDir(SNAPSHOT_DIR)
    const r = createReadable(`
%EXAMPLE: ${examplePath}%
`)
    const rs = new Replaceable(exampleRule)
    r.pipe(rs)
    const res = await catchment(rs)
    await test('rules/example/simple.md', res)
  },
  async 'replaces an example with type'(
    { createReadable, catchment, SNAPSHOT_DIR, examplePath }, { setDir, test },
  ) {
    setDir(SNAPSHOT_DIR)
    const r = createReadable(`
%EXAMPLE: ${examplePath}, javascript%
`)
    const rs = new Replaceable(exampleRule)
    r.pipe(rs)
    const res = await catchment(rs)
    await test('rules/example/type.md', res)
  },
  async 'replaces an example with replacement'(
    { createReadable, catchment, SNAPSHOT_DIR, examplePath }, { setDir, test },
  ) {
    setDir(SNAPSHOT_DIR)
    const r = createReadable(`
%EXAMPLE: ${examplePath}, ../src => documentary%
`)
    const rs = new Replaceable(exampleRule)
    r.pipe(rs)
    const res = await catchment(rs)
    await test('rules/example/replacement.md', res)
  },
  async 'replaces an example with replacement and type'(
    { createReadable, catchment, SNAPSHOT_DIR, examplePath }, { setDir, test },
  ) {
    setDir(SNAPSHOT_DIR)
    const r = createReadable(`
%EXAMPLE: ${examplePath}, ../src => documentary, javascript%
`)
    const rs = new Replaceable(exampleRule)
    r.pipe(rs)
    const res = await catchment(rs)
    await test('rules/example/replacement-type.md', res)
  },
  async 'does nothing when file cannot be read'({ createReadable, catchment }) {
    const s = `## API Method

This method allows to trim strings.

%EXAMPLE: /usr/bin, ../src => documentary, javascript%`
    const r = createReadable(s)
    const rs = new Replaceable(exampleRule)
    r.pipe(rs)
    const res = await catchment(rs)
    equal(res, s)
  },
}

export default T
