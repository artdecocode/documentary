import SnapshotContext from 'snapshot-context'
import Context from '../../context'

/** @type {Object.<string, (c: Context, s: SnapshotContext )>} */
const T = {
  context: [
    Context,
    SnapshotContext,
  ],
  async 'places a single type'(
    { createReadable, catchment, typesLocation, SNAPSHOT_DIR, replaceStream }, { setDir, test }
  ) {
    setDir(SNAPSHOT_DIR)
    const s = `%TYPEDEF ${typesLocation} StaticConfig%`
    const rs = createReadable(s)
    rs.pipe(replaceStream)
    const res = await catchment(replaceStream)
    await test('replace-stream/typedef.md', res)
  },
  async 'escapes a | in type\'s property'(
    { createReadable, catchment, typesPipeLocation, SNAPSHOT_DIR, replaceStream }, { setDir, test }
  ) {
    setDir(SNAPSHOT_DIR)
    const s = `%TYPEDEF ${typesPipeLocation} SessionConfig%`
    const rs = createReadable(s)
    rs.pipe(replaceStream)
    const res = await catchment(replaceStream)
    await test('replace-stream/typedef-pipe.md', res)
  },
  async 'places a single type without properties'(
    { createReadable, catchment, typesLocation, SNAPSHOT_DIR, replaceStream }, { setDir, test }
  ) {
    setDir(SNAPSHOT_DIR)
    const s = `%TYPEDEF ${typesLocation} SetHeaders%`
    const rs = createReadable(s)
    rs.pipe(replaceStream)
    const res = await catchment(replaceStream)
    await test('replace-stream/typedef-line.md', res)
  },
  async 'places all types from a file'(
    { createReadable, catchment, typesLocation, SNAPSHOT_DIR, replaceStream }, { setDir, test }
  ) {
    setDir(SNAPSHOT_DIR)
    const s = `%TYPEDEF ${typesLocation}%`
    const rs = createReadable(s)
    rs.pipe(replaceStream)
    const res = await catchment(replaceStream)
    await test('replace-stream/typedef-file.md', res)
  },
}

export default T
