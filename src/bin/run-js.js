import { createWriteStream, createReadStream } from 'fs'
import createJsReplaceStream from '../lib/js-replace-stream'
import Catchment from 'catchment'

/**
 * Process a JavaScript file.
 * @param {string} source Path to the source JavaScript file.
 */
export default async function runJs(source, output) {
  const s = createReadStream(source)
  const rs = createJsReplaceStream()
  s.pipe(rs)
  const c = new Catchment({
    rs,
  })
  const res = await c.promise
  const ws = createWriteStream(output || source)
  await new Promise((r, j) => {
    ws.on('error', j).end(res, r)
  })
  console.log('Updated %s to include types.', source)
}
