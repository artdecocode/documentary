import { equal } from 'zoroaster/assert'
import Context from '../../context'
import { badgeRe } from '../../../src/lib/rules/badge'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
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
