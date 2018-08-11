import SnapshotContext from 'snapshot-context'
import Catchment from 'catchment'
import Context from '../../context'
import extractTypedef from '../../../src/bin/run/extract'

/** @type {Object.<string, (c: Context, s: SnapshotContext )>} */
const T = {
  context: [
    Context,
    SnapshotContext,
  ],
  async 'extracts types from a file'({ SNAPSHOT_DIR, typedefJsPath: source }, { setDir, test }) {
    setDir(SNAPSHOT_DIR)
    const writable = new Catchment()
    await extractTypedef({
      writable,
      source,
    })
    const c = await writable.promise
    await test('extract.xml', c.trim())
  },
  async 'extracts properties without descriptions'({ SNAPSHOT_DIR, typedefJsPropPath: source }, { setDir, test }) {
    setDir(SNAPSHOT_DIR)
    const writable = new Catchment()
    await extractTypedef({
      writable,
      source,
    })
    const c = await writable.promise
    await test('extract-props.xml', c.trim())
  },
}

export default T
