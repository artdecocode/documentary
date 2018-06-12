import { equal } from 'zoroaster/assert'
import Context from '../context'
import { toc } from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof documentary, 'function')
  },
  async 'calls package without error'() {
    // await documentary()
  },
  async 'generates table of contents'({ structure }) {
  //   const res = toc(structure)

  // },
}

export default T
