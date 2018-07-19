import { equal } from 'zoroaster/assert'
import SnapshotContext from 'snapshot-context'
import Context from '../../context'
import { typedefJsRe } from '../../../src/lib/rules/typedef-js'

/** @type {Object.<string, (c: Context, s: SnapshotContext )>} */
const T = {
  context: [
    Context,
    SnapshotContext,
  ],
  async 'matches the xml snippet'({ getMatches }) {
    const l = 'types/static.xml'
    const g = `/* documentary ${l} */

`
    const { loc, gen } = getMatches(g, typedefJsRe, ['loc', 'gen'])
    equal(loc, l)
    equal(gen, undefined)
  },
  async 'matches the xml snippet with generated typedef below'({ getMatches }) {
    const l = 'types/static.xml'
    const p = `/**
* @typedef {Object} Test Generated type.
* @prop {string} hello Generated property.
*/
`
    const g = `/* documentary ${l} */
${p}
`
    const { loc, gen } = getMatches(g, typedefJsRe, ['loc', 'gen'])
    equal(loc, l)
    equal(gen, p)
  },
}

export default T
