import { createReadStream } from 'fs'
import { debuglog } from 'util'
import createJsReplaceStream from '../../lib/js-replace-stream'
import catcher from '../catcher'
import whichStream from './which-stream'

const LOG = debuglog('doc')

/**
 * Process a JavaScript file to include `@typedef`s found with the `/* documentary types.xml *\/` marker.
 * @param {Config} config Configuration Object.
 * @param {string} config.source Path to the source JavaScript file.
 * @param {string} [config.destination] Path to the source JavaScript file. If not specified, source is assumed (overwriting the original file).
 * @param {string} [config.stream] An output stream to which to write instead of a location from `generateTo`.
 */
async function generateTypedef(config) {
  const {
    source,
    destination = source,
    stream,
  } = config
  try {
    if (!source && !stream) {
      console.log('Please specify a JavaScript file or a pass a stream.')
      process.exit(1)
    }

    const s = createReadStream(source)
    const readable = createJsReplaceStream()
    s.pipe(readable)

    const p = whichStream({
      source,
      stream,
      readable,
      destination,
    })

    await new Promise((r, j) => {
      readable.on('error', e => { LOG('Error in Replaceable'); j(e) })
      s.on('error', e => { LOG('Error in Read'); j(e) })
      readable.on('end', r)
    })

    await p

    if (stream) {
      LOG('%s written to stream', source)
    } else if (source == destination) {
      console.error('Updated %s to include types.', source)
    } else if (destination == '-') {
      console.error('Written %s to stdout.', source)
    } else {
      console.error('Saved output to %s', destination)
    }
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
