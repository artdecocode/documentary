import { createWriteStream, createReadStream } from 'fs'
import Catchment from 'catchment'
import createJsReplaceStream from '../../lib/js-replace-stream'
import catcher from '../catcher'

/**
 * Process a JavaScript file.
 * @param {string} source Path to the source JavaScript file.
 */
export default async function runJs({
  source,
  output = source,
}) {
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
