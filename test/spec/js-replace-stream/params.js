import { ok } from 'zoroaster/assert'
import SnapshotContext from 'snapshot-context'
import Context from '../../context'
import createJsReplaceStream from '../../../src/lib/js-replace-stream'

/** @type {Object.<string, (c: Context, s: SnapshotContext )>} */
const T = {
  context: [
    Context,
    SnapshotContext,
  ],
  async 'remembers the parsed types in the Replaceable'(
    { typesLocation, catchment, createReadable }
  ) {
    const s = `
/* documentary ${typesLocation} */

`
    const rs = createReadable(s)
    const stream = createJsReplaceStream()
    rs.pipe(stream)
    await catchment(stream)
    ok('StaticConfig' in stream.types)
  },
//   async 'expands the type in function\'s JSDoc'(
//     { createReadable, catchment, typesLocation, SNAPSHOT_DIR }, { setDir, test }
//   ) {
//     setDir(SNAPSHOT_DIR)
//     const s = `import { resolve } from 'path'

// /**
//  * Configure the static middleware.
//  * @param {StaticConfig} config Configuration object.
//  */
// function configure(config) {
//   return resolve('test')
// }

// /* documentary ${typesLocation} */

// export default configure`
//     const rs = createReadable(s)
//     const stream = createJsReplaceStream()
//     rs.pipe(stream)
//     const res = await catchment(stream)
//     await test('js-replace-stream/jsdoc.js', res)
//   },
}

export default T
