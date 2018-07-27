import { createReadStream } from 'fs'
import createJsReplaceStream from '../../lib/js-replace-stream'
import catcher from '../catcher'
import whichStream from './which-stream'

/**
 * Process a JavaScript file to include `@typedef`s found with the `/* documentary types.xml *\/` marker.
 * @param {Config} config Configuration Object.
 * @param {string} config.source Path to the source JavaScript file.
 * @param {string} [config.generateTo] Path to the source JavaScript file. If not specified, source is assumed (overwriting the original file).
 * @param {string} [config.stream] An output stream to which to write instead of a location from `generateTo`.
 */
async function generateTypedef(config) {
  const {
    source,
    generateTo = source,
    stream: st,
  } = config
  try {
    if (!source && !st) {
      console.log('Please specify a JavaScript file or a pass a stream.')
      process.exit(1)
    }

    const s = createReadStream(source)
    const rs = createJsReplaceStream()
    s.pipe(rs)

    const { p } = whichStream(rs, st, generateTo)
    await p

    console.error(...(source == generateTo ? ['Updated %s to include types.', source] : ['Saved output to %s', generateTo]))
  } catch (err) {
    catcher(err)
  }
}

/**
 * @typedef {Object} Config
 * @prop {string} source Path to the source JavaScript file.
 * @prop {string} [output] Path to the source JavaScript file.
 */

export default generateTypedef
