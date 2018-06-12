# documentary

[![npm version](https://badge.fury.io/js/documentary.svg)](https://badge.fury.io/js/documentary)

`documentary` is a command-line tool and a library to manage documentation of Node.js packages.

<!-- such as README, usage, man pages and changelog. -->

```sh
# install doc binary
npm i -g documentary
```

```sh
yarn add -E documentary
```

The features include generation of table of content, github live preview and title generator.

## Table of Contents

%TOC%

## CLI

The `doc` client is available after installation.

### `-t`, `--toc`: Generate TOC

Table of Contents for the README page can be generated with `documentary` TOC generator.

```sh
doc -t input-source.md [-r] [-o output.md]
```

```md
- [Table Of Contents](#table-of-contents)
- [CLI](#cli)
  * [`-j`, `--jsdoc`: Add JSDoc](#-j---jsdoc-add-jsdoc)
- [API](#api)
- [Copyright](#copyright)
```

It will also include valid URLs used on GitHub to skip to the title when complex titles are given.

When `-r` or `--replace` argument is passed, the `%TOC%` placeholder in the file will be replaced with the generated table of contents. Passing `-o` allows to save the output to the file, otherwise it is printed into the _stdout_.

```sh
doc -t README-source.md -r -o README.md
```

```
Saved README.md from README-source.md
```

The command will also strip any comments found in `<!-- -->` blocks.

### `-l`, `--live`: GitHub Live

With GitHub live, `documentary` will monitor for any happening commits, push them to GitHub, extract the commit version, and refresh the page with open `README.md` file in Chrome browser. This allows to see the preview as it is viewed on GitHub.

```sh
doc live
```

## API

The programmatic use of the `documentary` is intended for developers who want to use this software in their projects.

<!-- ### extractStructure(markdown: string): object -->

<!-- ### MethodDescriptor

A method descriptor contains meta-information about a method, such as what arguments it takes, of what type, etc.

```js
const md = {
  name: 'methodName',
  arguments: {
    name: {
      type: 'string',
    },
  },
  return: 'string',
}
``` -->

### generateTitle(method: MethodDescriptor): string

Generate a title for a method, for example:

#### `koa2Jsx({`<br/>&nbsp;&nbsp;`reducer: function,`<br/>&nbsp;&nbsp;`View: Container,`<br/>&nbsp;&nbsp;`actions: object,`<br/>&nbsp;&nbsp;`static?: boolean = true,`<br/>&nbsp;&nbsp;`render?: function,`<br/>`}): function`

### `toc(readable: ReadableStream): string`

Generate table of contents.

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


<!-- const TOC = toc({
  packageName: [
    CLI: [
      '`-c`, `--command`: Execute Command',
      '`-h`, `--help`: Display Help',
    ],
    API: {
      '`toc(): string`'
    },
  },
}) -->


---

(c) [Art Deco Code][1] 2018

[1]: https://artdeco.bz
