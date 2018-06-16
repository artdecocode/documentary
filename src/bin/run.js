import { getToc } from '../lib/Toc'
import { createWriteStream } from 'fs'
import createReplaceStream from '../lib/replace-stream'
import { PassThrough } from 'stream'

const replaceFile = (stream, toc, out) => {
  const s = createReplaceStream(toc)

  const ws = out ? createWriteStream(out) : process.stdout

  stream.pipe(s).pipe(ws)
  if (out) {
    ws.on('close', () => {
      console.log('Saved %s', out)
    })
  }
}

/**
 * @param {Readable} stream A readable stream.
 * @param {string} [out] Path to the output file.
 * @param {boolean} [toc] Just print the TOC.
 */
export default async function run(stream, out, toc) {
  const pt = new PassThrough()
  pt.pause()
  stream.pipe(pt)
  const t = await getToc(stream)
  if (toc) {
    console.log(t)
    process.exit()
  }
  pt.resume()
  replaceFile(pt, t, out)
}
