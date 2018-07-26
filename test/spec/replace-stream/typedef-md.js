import SnapshotContext from 'snapshot-context'
import Context from '../../context'

/** @type {Object.<string, (c: Context, s: SnapshotContext )>} */
const T = {
  context: [
    Context,
    SnapshotContext,
  ],
  async 'places types table'(
    { createReadable, catchment, typesLocation, SNAPSHOT_DIR, replaceStream }, { setDir, test }
  ) {
    setDir(SNAPSHOT_DIR)
    const s = `%TYPEDEF ${typesLocation} StaticConfig%`
    const rs = createReadable(s)
    rs.pipe(replaceStream)
    const res = await catchment(replaceStream)
    await test('replace-stream/typedef-md.txt', res)
  },
  async 'places types line'(
    { createReadable, catchment, typesLocation, SNAPSHOT_DIR, replaceStream }, { setDir, test }
  ) {
    setDir(SNAPSHOT_DIR)
    const s = `%TYPEDEF ${typesLocation} SetHeaders%`
    const rs = createReadable(s)
    rs.pipe(replaceStream)
    const res = await catchment(replaceStream)
    await test('replace-stream/typedef-md-line.txt', res)
  },
  async 'places all types from a file'(
    { createReadable, catchment, typesLocation, SNAPSHOT_DIR, replaceStream }, { setDir, test }
  ) {
    setDir(SNAPSHOT_DIR)
    const s = `%TYPEDEF ${typesLocation}%`
    const rs = createReadable(s)
    rs.pipe(replaceStream)
    const res = await catchment(replaceStream)
    await test('replace-stream/typedef-md-file.txt', res)
  },
}

export default T
