import Context from '../../context'
import { innerCodeRe } from '../../../src/lib/rules'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  async 'matches inner code with the re'({ makeInnerCode, assertSingleMatch }) {
    const c = 'hello world'
    const s = makeInnerCode(c)
    assertSingleMatch(s, innerCodeRe)
  },
  async 'does not match ```'({ assertNoMatch, makeInnerCode }) {
    const s = makeInnerCode('`')
    assertNoMatch(s)
  },
  async 'does not match ````'({ assertNoMatch, makeInnerCode }) {
    const s = makeInnerCode('``')
    assertNoMatch(s)
  },
  async 'matches `a``'({ makeInnerCode, assertSingleMatch }) {
    const c = 'a`'
    const s = makeInnerCode(c)
    assertSingleMatch(s, innerCodeRe)
  },
  async 'matches ``a`'({ makeInnerCode, assertSingleMatch }) {
    const c = '`a'
    const s = makeInnerCode(c)
    assertSingleMatch(s, innerCodeRe)
  },
  async 'matches `hello `` abc `` world ` as three'({ makeInnerCode, assertNMatches }) {
    const s = `${makeInnerCode('hello ')}${makeInnerCode(' abc ')}${makeInnerCode( ' world ')}`
    assertNMatches(s, innerCodeRe, 3)
  },
  async 'matches `hello ` ` world ` as two'({ makeInnerCode, assertNMatches }) {
    const s = `${makeInnerCode('hello ')} ${makeInnerCode( ' world ')}`
    assertNMatches(s, innerCodeRe, 2)
  },
  async 'matches ``hello ` and ` world `` as two'({ makeInnerCode, assertNMatches }) {
    const s = `${makeInnerCode('`hello ')} ${makeInnerCode( ' world `')}`
    assertNMatches(s, innerCodeRe, 2)
  },
  async 'does not match blocks in comments'({ assertNoMatch }) {
    const s = `<!-- \`\`\`sh
      doc -t input-source.md [-r] [-o output.md]
      \`\`\` -->`
    assertNoMatch(s, innerCodeRe)
  },
}


export default T
