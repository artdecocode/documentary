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
  async 'expands the type in function\'s JSDoc'(
    { createReadable, catchment, typesLocation, SNAPSHOT_DIR }, { setDir, test }
  ) {
    setDir(SNAPSHOT_DIR)
    const s = `import { resolve } from 'path'

/**
 * Configure the static middleware.
 * @param {StaticConfig} config
 */
function configure(config) {
  return resolve('test')
}

/* documentary ${typesLocation} */

export default configure`
    const rs = createReadable(s)
    const stream = createJsReplaceStream()
    rs.pipe(stream)
    const res = await catchment(stream)
    await test('js-replace-stream/jsdoc.js', res)
  },
  async 'expands an optional type in function\'s JSDoc'(
    { createReadable, catchment, typesLocation, SNAPSHOT_DIR }, { setDir, test }
  ) {
    setDir(SNAPSHOT_DIR)
    const s = `import { resolve } from 'path'

/**
 * Configure the static middleware.
 * @param {StaticConfig} [config]
 */
function configure(config) {
  return resolve('test')
}

/* documentary ${typesLocation} */

export default configure`
    const rs = createReadable(s)
    const stream = createJsReplaceStream()
    rs.pipe(stream)
    const res = await catchment(stream)
    await test('js-replace-stream/jsdoc-optional.js', res)
  },
  async 'expands an expanded type in function\'s JSDoc'(
    { createReadable, catchment, typesLocation, SNAPSHOT_DIR }, { setDir, test }
  ) {
    setDir(SNAPSHOT_DIR)
    const s = `import { resolve } from 'path'

/**
 * Configure the static middleware.
 * @param {StaticConfig} config Options to setup \`koa-static\`.
 * @param {string} config.root Root directory string.
 * @param {number} [config.maxage=0] Browser cache max-age in milliseconds. Default \`0\`.
 * @param {boolean} [config.hidden=false] Allow transfer of hidden files. Default \`false\`.
 * @param {string} [config.index="index.html"] Default file name. Default \`index.html\`.
 * @param {SetHeaders} [config.setHeaders] Function to set custom headers on response.
 */
function configure(config) {
  return resolve('test')
}

/* documentary ${typesLocation} */

export default configure`
    const rs = createReadable(s)
    const stream = createJsReplaceStream()
    rs.pipe(stream)
    const res = await catchment(stream)
    await test('js-replace-stream/jsdoc.js', res)
  },
}

export default T
