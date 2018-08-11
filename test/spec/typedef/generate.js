import SnapshotContext from 'snapshot-context'
import { ok } from 'zoroaster/assert'
import Catchment from 'catchment'
import Context from '../../context'
import generateTypedef from '../../../src/bin/run/generate'

/** @type {Object.<string, (c: Context, s: SnapshotContext )>} */
const T = {
  context: [
    Context,
    SnapshotContext,
  ],
  async 'generates @typedefs with imports'({ SNAPSHOT_DIR, generateImports: source }, { setDir, test }) {
    setDir(SNAPSHOT_DIR)
    const writable = new Catchment()
    await generateTypedef({
      writable,
      source,
    })
    const c = await writable.promise
    ok(/@typedef/.test(c), 'Does not include a @typedef.')
    await test('typedef/generate-imports.js', c.trim())
  },
  async 'generates @typedefs with imports with existing'({ SNAPSHOT_DIR, generateImportsAfter: source }, { setDir, test }) {
    setDir(SNAPSHOT_DIR)
    const writable = new Catchment()
    await generateTypedef({
      writable,
      source,
    })
    const c = await writable.promise
    ok(/@typedef/.test(c), 'Does not include a @typedef.')
    await test('typedef/generate-imports.js', c.trim())
  },
}

export default T
