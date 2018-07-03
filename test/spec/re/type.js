import { equal } from 'zoroaster/assert'
import SnapshotContext from 'snapshot-context'
import Context from '../../context'
import { typeRe } from '../../../src/lib/rules/type'

/** @type {Object.<string, (c: Context, s: SnapshotContext )>} */
const T = {
  context: [
    Context,
    SnapshotContext,
  ],
  async 'matches the TYPE snippet'({ type, getMatches }) {
    const g = `%TYPE true
${type}
%`
    const { t, b } = getMatches(g, typeRe, ['t', 'b'])
    equal(t, ' true')
    equal(b, type)
  },
  async 'matches the TYPE snippet without toc'({ type, getMatches }) {
    const g = `%TYPE
${type}
%`
    const { t, b } = getMatches(g, typeRe, ['t', 'b'])
    equal(t, undefined)
    equal(b, type)
  },
}

export default T
