import { createWriteStream } from 'fs'

async function whichStream(readable, st, dest) {
  let p = Promise.resolve()
  if (st) {
    readable.pipe(st)
  } else if (dest == '-') {
    readable.pipe(process.stdout)
  } else {
    const ws = createWriteStream(dest)
    p = new Promise((r, j) => {
      ws.on('close', r)
      ws.on('error', j)
    })
    readable.pipe(ws)
  }
  return { p }
}

export default whichStream
