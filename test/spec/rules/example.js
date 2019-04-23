import { ok, equal } from 'assert'
import { deepEqual } from 'zoroaster/assert'
import Context, { MarkdownSnapshot } from '../../context'
import exampleRule, { re } from '../../../src/lib/rules/example'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: [Context, MarkdownSnapshot],
  'matches a single argument'({ examplePath }) {
    const res = re.exec(`%EXAMPLE: ${examplePath}%`)
    ok(res)
    const [, ...a] = res
    deepEqual(a, ['', examplePath, undefined, undefined, undefined])
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
    deepEqual(a, ['', examplePath, from, to, undefined])
  },
  'matches 2 arguments without replacement'({ examplePath, resetRe }) {
    const type = 'js'
    const s = `%EXAMPLE: ${examplePath}, ${type}%`
    resetRe(re)
    const res = re.exec(s)
    ok(res)
    const [, ...a] = res
    deepEqual(a, ['', examplePath, undefined, undefined, type])
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
    deepEqual(a, ['', examplePath, from, to, type])
  },
  async 'replaces an example without replacement'({ replace, examplePath }) {
    const s = `%EXAMPLE: ${examplePath}%`
    const { res } = await replace(exampleRule, s)
    return res
  },
  async 'replaces an example with type'({ replace, examplePath }) {
    const s = `%EXAMPLE: ${examplePath}, javascript%`
    const { res } = await replace(exampleRule, s)
    return res
  },
  async 'replaces an example with replacement'({ replace, examplePath }) {
    const s = `%EXAMPLE: ${examplePath}, ../src => documentary%`
    const { res } = await replace(exampleRule, s)
    return res
  },
  async 'replaces an example with replacement and type'({ replace, examplePath }) {
    const s = `%EXAMPLE: ${examplePath}, ../src => documentary, javascript%`
    const { res } = await replace(exampleRule, s)
    return res
  },
  async 'does nothing when file cannot be read'({ replace }) {
    const s = `## API Method

This method allows to trim strings.

%EXAMPLE: not-an-example, ../src => documentary, javascript%`
    const { res } = await replace(exampleRule, s)
    equal(res, s)
  },
}

export default T
