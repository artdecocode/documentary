import { getToc } from '../lib/Toc'
import { createWriteStream } from 'fs'
import createReplaceStream from '../lib/replace-stream'
import { PassThrough } from 'stream'

const replaceFile = async (stream, toc, out) => {
  await new Promise((r, j) => {
    const s = createReplaceStream(toc)

    const ws = out ? createWriteStream(out) : process.stdout

    stream.pipe(s).pipe(ws)
    if (out) {
      ws.on('close', () => {
        console.log('Saved %s', out)
        r()
      })
      ws.on('error', j)
    } else {
      r()
    }
  })
}

/**
 * @param {Readable} stream A readable stream.
 * @param {string} [out] Path to the output file.
 * @param {boolean} [justToc] Just print the TOC.
 * @param {boolean} [h1] Process top-level headers in the TOC.
 */
export default async function run(stream, out, justToc, h1) {
  const pt = new PassThrough()
  pt.pause()
  stream.pipe(pt)
  const t = await getToc(stream, h1)
  if (justToc) {
    console.log(t)
    process.exit()
  }
  pt.resume()
  await replaceFile(pt, t, out)
}
