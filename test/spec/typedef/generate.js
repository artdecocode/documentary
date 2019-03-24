import { ok } from 'zoroaster/assert'
import Catchment from 'catchment'
import Context, { JsSnapshot } from '../../context'
import generateTypedef from '../../../src/bin/run/generate'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: [Context, JsSnapshot],
  async 'generates @typedefs with imports'({ generateImports: source }) {
    const writable = new Catchment()
    await generateTypedef({
      writable,
      source,
    })
    const c = await writable.promise
    ok(/@typedef/.test(c), 'Does not include a @typedef.')
    return c
  },
  async 'generates @typedefs with imports with existing'({ generateImportsAfter: source }, { snapshotSource }) {
    const writable = new Catchment()
    await generateTypedef({
      writable,
      source,
    })
    const c = await writable.promise
    ok(/@typedef/.test(c), 'Does not include a @typedef.')
    snapshotSource('generates @typedefs with imports')
    return c
  },
}

export default T
