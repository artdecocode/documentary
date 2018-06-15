import { Toc } from '../src'
import Catchment from 'catchment'
import { createReadStream } from 'fs'
import { resolve } from 'path'
import { debuglog } from 'util'

const LOG = debuglog('doc')

const path = resolve(__dirname, 'markdown.md')

;(async () => {
  LOG('Reading %s', path)
  const md = createReadStream(path)
  const rs = new Toc()
  md.pipe(rs)

  const { promise } = new Catchment({
    rs,
  })
  const res = await promise
  console.log(res)
})()
