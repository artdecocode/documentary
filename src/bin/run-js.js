import { createWriteStream, createReadStream } from 'fs'
import Catchment from 'catchment'
import createJsReplaceStream from '../lib/js-replace-stream'

/**
 * Process a JavaScript file.
 * @param {string} source Path to the source JavaScript file.
 */
export default async function runJs(source, output = source) {
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
}
