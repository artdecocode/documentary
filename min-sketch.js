const { Replaceable } = require('restream')
const ds = require('@wrote/read-dir-structure')
const whichStream = require('which-stream')
const { join } = require('path')
const { createReadStream } = require('fs')

;(async () => {
  const p = 'src/section-breaks'
  const { content } = await ds.default(p)
  await Object.keys(content).reduce(async (acc, key) => {
    await acc
    const pp = join(p, key)
    console.log(pp)
    const r = new Replaceable([
      {
        re: /\s+<!--[\s\S]+?<\/defs>/,
        replacement: '',
      },
      {
        re: /id="Page-1" /,
        replacement: '',
      },
    ])
    const rs = createReadStream(pp)
    rs.pipe(r)
    await whichStream({
      readable: r,
      source: pp,
      destination: pp,
    })
  }, {})
})()