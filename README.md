# documentary

[![npm version](https://badge.fury.io/js/documentary.svg)](https://npmjs.org/package/documentary)

`documentary` is a command-line tool and a library to manage documentation of Node.js packages. Due to the fact that complex `README` files are harder to maintain, `documentary` serves as a pre-processor of documentation.

```sh
yarn add -E documentary
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [Installation & Usage](#installation--usage)
  * [VS Code Settings](#vs-code-settings)
- [Features](#features)
  * [TOC Generation](#toc-generation)
  * [Tables Display](#tables-display)
  * [Method Title](#method-title)
    * [`async runSoftware(path: string, config: object): string`](#async-runsoftwarepath-stringconfig-view-containeractions-objectstatic-boolean--truerender-function-string)
    * [`async runSoftware(path: string)`](#async-runsoftwarepath-string-void)
    * [`runSoftware(): string`](#runsoftware-string)
  * [Comments Stripping](#comments-stripping)
  * [File Splitting](#file-splitting)
- [CLI](#cli)
- [API](#api)
  * [`new Toc()`](#new-toc)

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
### VS Code Settings

It might be confusing to have a source and output `README.md` file, therefore to prevent errors, the following snippet can be used to hide the compiled file from VS Code search (update the `.vscode/settings.json` file):

```json
{
  "search.exclude": {
    "**/README.md": true
  }
}
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

### Method Title

It is possible to generate neat titles useful for API documentation with `documentary`. The method signature should be specified as a `JSON` array, where every member is an argument specified as an array. The first item in the argument array is the argument name, and the second one is type. Type can be either a string, or an object. If it is an object, each value in the object will first contain the property type, and the second one the default value. To mark a property as optional, the `?` symbol can be used at the end.

#### `async runSoftware(`<br/>&nbsp;&nbsp;`path: string,`<br/>&nbsp;&nbsp;`config: {`<br/>&nbsp;&nbsp;&nbsp;&nbsp;`View: Container,`<br/>&nbsp;&nbsp;&nbsp;&nbsp;`actions: object,`<br/>&nbsp;&nbsp;&nbsp;&nbsp;`static?: boolean = true,`<br/>&nbsp;&nbsp;&nbsp;&nbsp;`render?: function,`<br/>&nbsp;&nbsp;`},`<br/>`): string`

Generated from

````m
```#️⃣#️⃣#️⃣#️⃣ async runSoftware => string
[
  ["path", "string"],
  ["config", {
    "View": ["Container"],
    "actions": ["object"],
    "static?": ["boolean", true],
    "render?": ["function"]
  }]
]
```
````

#### `async runSoftware(`<br/>&nbsp;&nbsp;`path: string,`<br/>`): void`

Generated from

````m
```#️⃣#️⃣#️⃣#️⃣ async runSoftware => string
[
  ["path", "string"]
]
```
````

#### `runSoftware(): string`

Generated from

````m
```#️⃣#️⃣#️⃣#️⃣ async runSoftware => string
```
````
### Comments Stripping

Since comments found in `<!—— comment ——>` sections are not visible to users, they will be removed from the output document.
### File Splitting

`documentary` can read a directory and put files together into a single `README` file. The files will be sorted in alphabetical order, and their content merged into a single stream. The `index.md` and `footer.md` are special in this respect, so that the `index.md` of a directory will always go first, and the `footer.md` will go last.

Example structure used in this project:

```m
README
├── 1-installation-and-usage
│   ├── 1-vs-code.md
│   └── index.md
├── 2-features
│   ├── 1-TOC-generation.md
│   ├── 2-table-display.md
│   ├── 3-method-title.md
│   ├── 4-comment-stripping.md
│   ├── 5-file-splitting.md
│   └── index.md
├── 3-cli.md
├── 4-api
│   ├── 1-toc.md
│   └── index.md
├── footer.md
└── index.md
```
## CLI

The program is used from the CLI (or `package.json` script).

```sh
doc README-source.md [-o README.md] [-t] [-w]
```

The arguments it accepts are:

| argument | Description |
| -------- | ----------- |
| `-o` | Where to save the processed `README` file. If not specified, the output is written to the `stdout`. |
| `-t` | Only extract and print the table of contents. |
| `-w` | Watch mode: re-run the program when changes to the source file are detected. |

When `NODE_DEBUG=doc` is set, the program will print debug information, e.g.,

```
DOC 80734: stripping comment
DOC 80734: could not parse the table
```
## API

The programmatic use of the `documentary` is intended for developers who want to use this software in their projects.
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

---

(c) [Art Deco Code][1] 2018

[1]: https://artdeco.bz
