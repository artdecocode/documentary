# documentary

[![npm version](https://badge.fury.io/js/documentary.svg)](https://badge.fury.io/js/documentary)

`documentary` is a command-line tool and a library to manage documentation of Node.js packages. Due to the fact that complex `README` files are harder to maintain, `documentary` serves as a pre-processor of documentation.

<!-- It can be installed as a dependency, and run as a `package.json` script, using a `doc` command. -->

```sh
yarn add -E documentary
```

## Table of Contents

%TOC%

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

It might be confusing to have a source and ouput `README.md` file, therefore to prevent errors, the following snippet can be used to hide the compiled file from VS Code search (update the `.vscode/settings.json` file):

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

<!-- ```sh
doc -t input-source.md [-r] [-o output.md]
``` -->

```md
- [Table Of Contents](#table-of-contents)
- [CLI](#cli)
  * [`-j`, `--jsdoc`: Add JSDoc](#-j---jsdoc-add-jsdoc)
- [API](#api)
- [Copyright](#copyright)
```

### Comments Stripping

Since comments found in `<!—— comment ——>` sections are not visible to users, they will be removed from the output document.

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

<!-- It will also include valid URLs used on GitHub to skip to the title when complex titles are given.

When `-r` or `--replace` argument is passed, the `%TOC%` placeholder in the file will be replaced with the generated table of contents. Passing `-o` allows to save the output to the file, otherwise it is printed into the _stdout_.

```sh
doc -t README-source.md -r -o README.md
``` -->

<!-- ```
Saved README.md from README-source.md
``` -->

<!-- The command will also strip any markdown comments (e,g., ). -->

<!-- ### `-l`, `--live`: GitHub Live

With GitHub live, `documentary` will monitor for any happening commits, push them to GitHub, extract the commit version, and refresh the page with open `README.md` file in Chrome browser. This allows to see the preview as it is viewed on GitHub.

```sh
doc live
``` -->

## CLI

The program is used from the CLI (or `package.json` script).

```sh
doc README-source.md [-o README.md] [-t] [-w]
```

The arguments it accepts are:

```table
[
  ["argument", "Description"],
  ["`-o`", "Where to save the processed `README` file. If not specified, the output is written to the `stdout`."],
  ["`-t`", "Only extract and print the table of contents."],
  ["`-w`", "Watch mode: re-run the program when changes to the source file are detected."]
]
```

When `NODE_DEBUG=doc` is set, the program will print debug information, e.g.,

```
DOC 80734: stripping comment
DOC 80734: could not parse the table
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

<!-- ### generateTitle(method: MethodDescriptor): string

Generate a title for a method, for example:

`koa2Jsx({`<br/>&nbsp;&nbsp;`reducer: function,`<br/>&nbsp;&nbsp;`View: Container,`<br/>&nbsp;&nbsp;`actions: object,`<br/>&nbsp;&nbsp;`static?: boolean = true,`<br/>&nbsp;&nbsp;`render?: function,`<br/>`}): function` -->

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
