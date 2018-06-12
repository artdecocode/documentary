import Toc from '../lib/Toc'
import { debuglog } from 'util'
import Catchment from 'catchment'
import { replaceStream } from 'restream'
import { createWriteStream, createReadStream } from 'fs'

const LOG = debuglog('doc')

const replaceFile = (path, re, replacement, outfile) => {
  const rs = createReadStream(path)
  const s = replaceStream([
    {
      re,
      replacement,
    },
    {
      re: /<!--[\s\S]*?-->\n+/g,
      replacement: '',
    },
  ])

  const ws = outfile ? createWriteStream(outfile) : process.stdout

  rs.pipe(s).pipe(ws)
  if (outfile) {
    ws.on('close', () => {
      console.log('Saved %s from %s', outfile, path)
    })
  }
}

const runToc = async (path, out, replace) => {
  LOG('reading %s', path)
  const md = createReadStream(path)
  const rs = new Toc()
  md.pipe(rs)
  if (replace) {
    const { promise } = new Catchment({ rs })
    const t = await promise
    replaceFile(path, /^%TOC%$/gm, t.trim(), out)
  } else {
    rs.pipe(process.stdout)
  }
}

export default runToc
