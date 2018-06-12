# documentary

[![npm version](https://badge.fury.io/js/documentary.svg)](https://badge.fury.io/js/documentary)

`documentary` is a new Node.js npm package. A library to manage documentation, such as README, usage, man pages and changelog.

```sh
yarn add -E documentary
```

## Table of Contents

- [Table of Contents](#table-of-contents)
- [CLI](#cli)
  * [Generate TOC](#generate-toc)
  * [GitHub Live](#github-live)
- [API](#api)
  * [extractStructure(markdown: string): object](#extractstructuremarkdown-string-object)
  * [MethodDescriptor](#methoddescriptor)
  * [generateTitle(method: MethodDescriptor): string](#generatetitlemethod-methoddescriptor-string)
    * [`koa2Jsx({`<br/>&nbsp;&nbsp;`reducer: function,`<br/>&nbsp;&nbsp;`View: Container,`<br/>&nbsp;&nbsp;`actions: object,`<br/>&nbsp;&nbsp;`static?: boolean = true,`<br/>&nbsp;&nbsp;`render?: function,`<br/>`}): function`](#koa2jsxbrnbspnbspreducer-functionbrnbspnbspview-containerbrnbspnbspactions-objectbrnbspnbspstatic-boolean--truebrnbspnbsprender-functionbr-function)
  * [`toc(readable: ReadableStream): string`](#tocreadable-readablestream-string)

## CLI

### Generate TOC

TOC for the README page can be generated with the TOC generator.

```sh
doc README.md
```

It will also include valid URLs used on GitHub to skip to the title when complex titles are given.

### GitHub Live

With GitHub live, `documentary` will monitor for any happening commits, push them to GitHub, extract the commit version, and refresh the page with open `README.md` file in Chrome browser. This allows to see the preview as it is viewed on GitHub.

```sh
doc live
```

## API

The programmatic use of the `documentary` is intended for developers who want to use this software in their projects.

### extractStructure(markdown: string): object

### MethodDescriptor

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
```

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

const path = resolve(__dirname, 'markdown.md')

;(async () => {
  const md = createReadStream(path)
  const rs = new Toc()
  md.pipe(rs)
  const { promise } = new Catchment({
    rs,
  })
  await promise
})()
```

```fs

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
