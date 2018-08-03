import { deepEqual } from 'zoroaster/assert'
import SnapshotContext from 'snapshot-context'
import Context from '../../context'
import { typedefMdRe } from '../../../src/lib/rules/typedef-md'

/** @type {Object.<string, (c: Context, s: SnapshotContext )>} */
const T = {
  context: [
    Context,
    SnapshotContext,
  ],
  async 'matches the TYPEDEF marker'({ getMatches }) {
    const loc = 'types/static.xml'
    const type = 'StaticConfig'
    const g = `%TYPEDEF ${loc} ${type}%`
    const res = getMatches(g, typedefMdRe, ['loc', 'type'])
    deepEqual(res, {
      loc,
      type,
    })
  },
  async 'matches the TYPEDEF marker without specific type'({ getMatches }) {
    const loc = 'types/static.xml'
    const g = `%TYPEDEF ${loc}%`
    const res = getMatches(g, typedefMdRe, ['loc'])
    deepEqual(res, {
      loc,
    })
  },
}

export default T
