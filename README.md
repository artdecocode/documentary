# documentary

[![npm version](https://badge.fury.io/js/documentary.svg)](https://badge.fury.io/js/documentary)

`documentary` is a command-line tool and a library to manage documentation of Node.js packages. It can be installed as a dependency, and run as a `package.json` script, using a `doc` command.

```sh
yarn add -E documentary
```

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Installation & Usage](#installation--usage)
- [Features](#features)
  * [TOC Generation](#toc-generation)
  * [Comments Stripping](#comments-stripping)
  * [Tables Display](#tables-display)
- [API](#api)
    * [`koa2Jsx({`<br/>&nbsp;&nbsp;`reducer: function,`<br/>&nbsp;&nbsp;`View: Container,`<br/>&nbsp;&nbsp;`actions: object,`<br/>&nbsp;&nbsp;`static?: boolean = true,`<br/>&nbsp;&nbsp;`render?: function,`<br/>`}): function` -->](#koa2jsxreducer-functionview-containeractions-objectstatic-boolean--truerender-function-function---)
  * [`new Toc(readable: ReadableStream)`](#new-tocreadable-readablestream)

## Installation & Usage

The `doc` client is available after installation. It can be used in a `doc` script of `package.json`, as follows:

```json
{
  "scripts": {
    "doc": "doc README-source.md -o README.md",
    "dc": "git add README-source.md README.md && git commit -m ",
  }
}
```

Therefore, to run produce an output README.md, the following command will be used:

```sh
yarn doc
```

The `dc` command is just a convenience script to commit both source and output files with a passed commit message, such as:

```sh
yarn dc 'add copyright'
```

## Features

The processed `README-source.md` file will have a generated table of contents, markdown tables and neat titles for API method descriptions.

### TOC Generation

Table of contents are useful for navigation the README document. When a `%TOC%` placeholder is found in the file, it will be replaced with an extracted structure.

```md
- [Table Of Contents](#table-of-contents)
- [CLI](#cli)
  * [`-j`, `--jsdoc`: Add JSDoc](#-j---jsdoc-add-jsdoc)
- [API](#api)
- [Copyright](#copyright)
```

### Comments Stripping

Since comments found in `<!—— comment ——>` sections are not visible to users, they can be removed from the output document.

### Tables Display

To describe method arguments in a table, but prepare them in a more readable format, `documentary` will parse the code blocks with `table` language as a table. The blocks must be in `JSON` format and contain a single array of arrays which represent rows.

````m
```tаble
[
  ["arg", "description"],
  ["-f", "Display only free domains"],
  ["-z", "A list of zones to check"],
]
```
````

Result:

| arg | description |
| --- | ----------- |
| -f | Display only free domains |
| -z | A list of zones to check |

## API

The programmatic use of the `documentary` is intended for developers who want to use this software in their projects.

### `new Toc(readable: ReadableStream)`

Toc is a reabable stream which can generate the table of contents.

```js
/* yarn example/toc.js */
import { Toc } from 'documentary'
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
  const rs = new Toc(md)
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


---

(c) [Art Deco Code][1] 2018

[1]: https://artdeco.bz
