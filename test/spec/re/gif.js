import { equal } from 'zoroaster/assert'
import SnapshotContext from 'snapshot-context'
import Context from '../../context'
import { gifRe } from '../../../src/lib/rules/gif'

/** @type {Object.<string, (c: Context, s: SnapshotContext )>} */
const T = {
  context: [
    Context,
    SnapshotContext,
  ],
  async 'matches the gif snippet'() {
    const p = 'path/file.gif'
    const s = '<code>Summary</code>`'
    const a = 'Alternative'
    const g = `%GIF ${p}
${a}
${s}
%`
    let path
    let alt
    let sum
    g.replace(gifRe, (match, p1, p2, p3) => {
      path = p1
      alt = p2
      sum = p3
    })
    equal(path, p)
    equal(alt, a)
    equal(sum, s)
  },
}

export default T
