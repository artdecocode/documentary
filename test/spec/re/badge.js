import { equal } from 'zoroaster/assert'
import SnapshotContext from 'snapshot-context'
import Context from '../../context'
import { badgeRe } from '../../../src/lib/rules/badge'

/** @type {Object.<string, (c: Context, s: SnapshotContext )>} */
const T = {
  context: [
    Context,
    SnapshotContext,
  ],
  async 'matches the badge snippet with an org scope'({ getMatches }) {
    const p = '@adc/documentary'
    const g = `%NPM: ${p}%`
    const { pack } = getMatches(g, badgeRe, ['pack'])
    equal(pack, p)
  },
  async 'matches the badge snippet'({ getMatches }) {
    const p = 'documentary'
    const g = `%NPM: ${p}%`
    const { pack } = getMatches(g, badgeRe, ['pack'])
    equal(pack, p)
  },
}


export default T
