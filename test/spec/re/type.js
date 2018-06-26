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
  async 'matches the TYPE snippet'({ type }) {
    const g = `%TYPE true
${type}
%`
    let t
    let b
    g.replace(typeRe, (match, p1, p2) => {
      t = p1
      b = p2
    })
    equal(t, ' true')
    equal(b, type)
  },
  async 'matches the TYPE snippet without toc'({ type }) {
    const g = `%TYPE
${type}
%`
    let t
    let b
    g.replace(typeRe, (match, p1, p2) => {
      t = p1
      b = p2
    })
    equal(t, undefined)
    equal(b, type)
  },
}

export default T
