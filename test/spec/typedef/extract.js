import SnapshotContext from 'snapshot-context'
import Context from '../../context'
import extractTypedef from '../../../src/bin/run/extract'
import { PassThrough } from 'stream'

/** @type {Object.<string, (c: Context, s: SnapshotContext )>} */
const T = {
  context: [
    Context,
    SnapshotContext,
  ],
  async 'extracts types from a file'({ catchment, SNAPSHOT_DIR, typedefJsPath: source }, { setDir, test }) {
    setDir(SNAPSHOT_DIR)
    const stream = new PassThrough()
    const p = catchment(stream)
    await extractTypedef({
      stream,
      source,
    })
    const c = await p
    await test('extract.xml', c)
  },
  async 'extracts properties without descriptions'({ SNAPSHOT_DIR, typedefJsPropPath: source, catchment }, { setDir, test }) {
    setDir(SNAPSHOT_DIR)
    const stream = new PassThrough()
    const p = catchment(stream)
    await extractTypedef({
      stream,
      source,
    })
    const c = await p
    await test('extract-props.xml', c)
  },
}

export default T
