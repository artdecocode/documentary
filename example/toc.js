import { Toc } from '../src'
import Catchment from 'catchment'
import { createReadStream } from 'fs'
import { resolve } from 'path'
import { debuglog } from 'util'

const LOG = debuglog('doc')

const path = resolve(__dirname, 'markdown.md')

// read the argument from yarn script, or execute against default readme file.
const [,,, arg2] = process.argv
const p = arg2 || path

;(async () => {
  LOG('Reading %s', p)
  const md = createReadStream(p)
  const rs = new Toc()
  md.pipe(rs)

  const { promise } = new Catchment({
    rs,
  })
  const res = await promise
  console.log(res)
})()
