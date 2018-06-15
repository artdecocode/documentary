import Toc, { getToc } from '../lib/Toc'
import { debuglog } from 'util'
import { createReadStream, createWriteStream } from 'fs'
import Catchment from 'catchment'
import createReplaceStream from '../lib/replace-stream'

const LOG = debuglog('doc')

const replaceFile = async (path, out) => {
  const rs = createReadStream(path)
  const s = createReplaceStream()

  const toc = new Toc()

  const { promise: tocPromise } = new Catchment({
    rs: toc,
  })
  const { promise } = new Catchment({
    rs: s,
  })

  rs.pipe(s).pipe(toc)

  const t = await tocPromise
  const res = await promise

  const realRes = res.replace(/^%TOC%$/gm, t.trim())
  if (out) {
    const ws = createWriteStream(out)
    ws.end(realRes)

    ws.on('close', () => {
      console.log('Saved %s from %s', out, path)
    })
  } else {
    console.log(realRes)
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
  if (toc) {
    const t = await getToc(path)
    console.log(t)
    process.exit()
  }

  await replaceFile(path, out)
}
