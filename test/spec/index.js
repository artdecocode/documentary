import { equal } from 'zoroaster/assert'
import Context from '../context'
import documentary from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof documentary, 'function')
  },
  async 'calls package without error'() {
    await documentary()
  },
  async 'calls test context method'({ example }) {
    await example()
  },
}

export default T
