import Catchment from 'catchment'
import { createWriteStream } from 'fs'

async function whichStream({
  source,
  readable,
  stream,
  destination,
}) {
  if (stream) {
    readable.pipe(stream) // push to stream
    await new Promise((r, j) => {
      stream.once('error', j).once('end', r)
    })
  } else if (destination == '-') { // printing to stdout
    readable.pipe(process.stdout)
  } else if (source == destination) { // overwriting file
    const { promise } = new Catchment({ rs: readable })
    const res = await promise
    const ws = createWriteStream(destination)
    await new Promise((r, j) => {
      ws.once('error', j).end(res, r)
    })
  } else {
    const ws = createWriteStream(destination)
    readable.pipe(ws)
    await new Promise((r, j) => {
      ws.on('error', j).on('close', r)
    })
  }
}

export default whichStream
