import { equal } from 'zoroaster/assert'
import Context from '../../context'
import { gifRe } from '../../../src/lib/rules/gif'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  async 'matches the gif snippet'({ getMatches }) {
    const p = 'path/file.gif'
    const s = '<code>Summary</code>`'
    const a = 'Alternative'
    const g = `%GIF ${p}
${a}
${s}
%`
    const { path, alt, sum } = getMatches(g, gifRe, ['path', 'alt', 'sum'])
    equal(path, p)
    equal(alt, a)
    equal(sum, s)
  },
}

export default T
