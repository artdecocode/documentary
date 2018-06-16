### `new Toc()`

Toc is a transform stream which can generate a table of contents.

```js
/* yarn example/toc.js */
import { Toc } from 'documentary'
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
```

```sh
yarn example/toc.js
```

```fs
$ NODE_DEBUG=doc yarn e example/toc.js
$ node example example/toc.js
DOC 13980: Reading /documentary/example/markdown.md
- [Table Of Contents](#table-of-contents)
- [CLI](#cli)
  * [`-j`, `--jsdoc`: Add JSDoc](#-j---jsdoc-add-jsdoc)
- [API](#api)
- [Copyright](#copyright)
```
