import Zoroaster from 'zoroaster'
import { ok } from 'zoroaster/assert'
import Context from '../../context'
import createJsReplaceStream from '../../../src/lib/js-replace-stream'

/** @type {Object.<string, (c: Context, z: Zoroaster)>} */
const T = {
  context: [Context, Zoroaster],
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
  async 'expands the type in function\'s JSDoc'({ createReadable, catchment, typesLocation }, { snapshotExtension }) {
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
    snapshotExtension('js')
    return res
  },
  async 'expands an optional type in function\'s JSDoc'(
    { createReadable, catchment, typesLocation }, { snapshotExtension }
  ) {
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
    snapshotExtension('js')
    return res
  },
  async 'expands an expanded type in function\'s JSDoc'(
    { createReadable, catchment, typesLocation }, { snapshotSource }
  ) {
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
    snapshotSource('expands the type in function\'s JSDoc', 'js')
    return res
  },
}

export default T
