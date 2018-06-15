import { getToc } from '../lib/Toc'
import { debuglog } from 'util'
import { createReadStream, createWriteStream } from 'fs'
import createReplaceStream from '../lib/replace-stream'

const LOG = debuglog('doc')

const replaceFile = (path, toc, out) => {
  const rs = createReadStream(path)

  const s = createReplaceStream(toc)

  const ws = out ? createWriteStream(out) : process.stdout

  rs.pipe(s).pipe(ws)
  if (out) {
    ws.on('close', () => {
      console.log('Saved %s from %s', out, path)
    })
  }
}

/**
 * @param {string} path
 * @param {string} [out]
 * @param {string} [out]
 * @param {boolean} [toc]
 */
export default async function run(path, out, toc) {
  LOG('reading %s', path)
  const t = await getToc(path)
  if (toc) {
    console.log(t)
    process.exit()
  }

  replaceFile(path, t, out)
}
