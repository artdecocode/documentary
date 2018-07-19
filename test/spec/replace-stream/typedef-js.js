import SnapshotContext from 'snapshot-context'
import Context from '../../context'
import createJsReplaceStream from '../../../src/lib/js-replace-stream'

/** @type {Object.<string, (c: Context, s: SnapshotContext )>} */
const T = {
  context: [
    Context,
    SnapshotContext,
  ],
  async 'places types declaration'(
    { createReadable, catchment, typesLocation, SNAPSHOT_DIR }, { setDir, test }
  ) {
    setDir(SNAPSHOT_DIR)
    const s = `/* documentary ${typesLocation} */\n\n`
    const rs = createReadable(s)
    const stream = createJsReplaceStream()
    rs.pipe(stream)
    const res = await catchment(stream)
    await test('replace-stream/typedef-js.txt', res)
  },
}

export default T
