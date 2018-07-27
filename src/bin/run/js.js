import { createWriteStream, createReadStream } from 'fs'
import Catchment from 'catchment'
import createJsReplaceStream from '../../lib/js-replace-stream'
import catcher from '../catcher'

/**
 * Process a JavaScript file to include `@typedef`s found with the `/* documentary types.xml *\/` marker.
 * @param {Config} config Configuration Object.
 * @param {string} config.source Path to the source JavaScript file.
 * @param {string} [config.output] Path to the source JavaScript file.
 */
async function runJs(config) {
  const {
    source,
    output = source,
  } = config
  try {
    if (!source) {
      console.log('Please specify a JavaScript file.')
      process.exit(1)
    }

    const s = createReadStream(source)
    const rs = createJsReplaceStream()
    s.pipe(rs)
    const c = new Catchment({
      rs,
    })
    const res = await c.promise
    const ws = createWriteStream(output)
    await new Promise((r, j) => {
      ws.on('error', j).end(res, r)
    })
    console.log(...(source == output ? ['Updated %s to include types.', source] : ['Saved output to %s', output]))
  } catch (err) {
    catcher(err)
  }
}

/**
 * @typedef {Object} Config
 * @prop {string} source Path to the source JavaScript file.
 * @prop {string} [output] Path to the source JavaScript file.
 */

export default runJs
