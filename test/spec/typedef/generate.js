import SnapshotContext from 'snapshot-context'
import { PassThrough } from 'stream'
import { ok } from 'zoroaster/assert'
import Context from '../../context'
import generateTypedef from '../../../src/bin/run/generate'

/** @type {Object.<string, (c: Context, s: SnapshotContext )>} */
const T = {
  context: [
    Context,
    SnapshotContext,
  ],
  async 'generates @typedefs with imports'({ catchment, SNAPSHOT_DIR, generateImports: source }, { setDir, test }) {
    setDir(SNAPSHOT_DIR)
    const stream = new PassThrough()
    const p = catchment(stream)
    await generateTypedef({
      stream,
      source,
    })
    const c = await p
    ok(/@typedef/.test(c), 'Does not include a @typedef.')
    await test('typedef/generate-imports.js', c)
  },
  async 'generates @typedefs with imports with existing'({ catchment, SNAPSHOT_DIR, generateImportsAfter: source }, { setDir, test }) {
    setDir(SNAPSHOT_DIR)
    const stream = new PassThrough()
    const p = catchment(stream)
    await generateTypedef({
      stream,
      source,
    })
    const c = await p
    ok(/@typedef/.test(c), 'Does not include a @typedef.')
    await test('typedef/generate-imports.js', c)
  },
}

export default T
