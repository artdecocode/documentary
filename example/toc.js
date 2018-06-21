/* yarn example/toc.js */
import { Toc } from '../src'
import Catchment from 'catchment'
import { createReadStream } from 'fs'

(async () => {
  try {
    const md = createReadStream('example/markdown.md')
    const rs = new Toc()
    md.pipe(rs)

    const { promise } = new Catchment({ rs })
    const res = await promise
    console.log(res)
  } catch ({ stack }) {
    console.log(stack)
  }
})()
