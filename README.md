# documentary

[![npm version](https://badge.fury.io/js/documentary.svg)](https://npmjs.org/package/documentary)

`documentary` is a command-line tool and a library to manage documentation of Node.js packages. Due to the fact that complex `README` files are harder to maintain, `documentary` serves as a pre-processor of documentation.

```sh
yarn add -DE documentary
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [Installation & Usage](#installation--usage)
  * [VS Code Settings](#vs-code-settings)
- [Features](#features)
  * [TOC Generation](#toc-generation)
    * [TOC Titles](#toc-titles)
      * [Specific Level](#specific-level)
  * [Tables Display](#tables-display)
  * [Method Title](#method-title)
    * [`async runSoftware(path: string, config: object): string`](#async-runsoftwarepath-stringconfig-view-containeractions-objectstatic-boolean--truerender-function-string)
    * [`async runSoftware(path: string)`](#async-runsoftwarepath-string-void)
    * [`runSoftware(): string`](#runsoftware-string)
  * [Comments Stripping](#comments-stripping)
  * [File Splitting](#file-splitting)
  * [Replacement Rules](#replacement-rules)
    * [`%NPM: package-name%`](#npm-package-name)
    * [`%TREE directory ...args%`](#tree-directory-args)
    * [`%FORK(-lang)? module ...args%`](#fork-lang-module-args)
  * [Examples Placement](#examples-placement)
  * [Gif Detail](#gif-detail)
    * [<code>yarn doc</code>](#yarn-doc)
  * [`Type` Definition](#type-definition)
- [CLI](#cli)
- [API](#api)
  * [`Toc` Type](#toc-type)
  * [`constructor(config?: object): Toc`](#constructorconfig-skiplevelone-boolean--true-toc)

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

Table of contents are useful for navigation the README document. When a `%TOC%` placeholder is found in the file, it will be replaced with an extracted structure. Titles appearing in comments and code blocks will be skipped.

```md
- [Table Of Contents](#table-of-contents)
- [CLI](#cli)
  * [`-j`, `--jsdoc`: Add JSDoc](#-j---jsdoc-add-jsdoc)
- [API](#api)
- [Copyright](#copyright)
```

#### TOC Titles

To be able to include a link to a specific position in the text (i.e., create an "anchor"), `documentary` supports a `TOC Titles` feature. Any text written as `[Toc Title](t)` will generate a relevant position in the table of contents. It will automatically detect the appropriate level and be contained inside the current section.

This feature can be useful when presenting some data in a table in a section, but wanting to include a link to each row in the table of contents so that the structure is immediately visible.

**<a name="specific-level">Specific Level</a>**: if required, the level can be specified with a number of `#` symbols, such as `[Specific Level](######)`.
### Tables Display

To describe method arguments in a table, but prepare them in a more readable format, `documentary` will parse the code blocks with `table` language as a table. The blocks must be in `JSON` format and contain a single array of arrays which represent rows.

````m
```table
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
```#### async runSoftware => string
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
```#### async runSoftware
[
  ["path", "string"]
]
```
````

#### `runSoftware(): string`

Generated from

````m
```#### runSoftware => string
```
````
### Comments Stripping

Since comments found in `<!-- comment -->` sections are not visible to users, they will be removed from the output document.
### File Splitting

`documentary` can read a directory and put files together into a single `README` file. The files will be sorted in alphabetical order, and their content merged into a single stream. The `index.md` and `footer.md` are special in this respect, so that the `index.md` of a directory will always go first, and the `footer.md` will go last.

Example structure used in this project:

```m
documentation
├── 1-installation-and-usage
│   ├── 1-vs-code.md
│   └── index.md
├── 2-features
│   ├── 1-TOC-generation.md
│   ├── 2-table-display.md
│   ├── 3-method-title.md
│   ├── 4-comment-stripping.md
│   ├── 5-file-splitting.md
│   ├── 6-rules.md
│   ├── 7-examples.md
│   ├── 8-gif.md
│   ├── 9-type.md
│   └── index.md
├── 3-cli.md
├── 4-api
│   ├── 1-toc.md
│   └── index.md
├── footer.md
└── index.md
```
### Replacement Rules

There are some built-in rules for replacements.

| Rule | Description |
| ---- | ----------- |
| <a name="npm-package-name">`%NPM: package-name%`</a> | Adds an NPM badge, e.g., `[![npm version] (https://badge.fury.io/js/documentary.svg)] (https://npmjs.org/package/documentary)` |
| <a name="tree-directory-args">`%TREE directory ...args%`</a> | Executes the `tree` command with the given arguments. If `tree` is not installed, warns and does not replace the match. |
| <a name="fork-lang-module-args">`%FORK(-lang)? module ...args%`</a> | Forks the Node.js process to execute the module using `child_process.fork`. The output is printed in the code block, with optionally given language. For example: `%FORK-json example.js -o%` |
### Examples Placement

`documentary` can be used to embed examples into the documentation. The example file needs to be specified with the following marker:

```
%EXAMPLE: examples/example.js, ../src => documentary%
```

The first argument is the path to the example relative to the working directory of where the command was executed (normally, the project folder). The second optional argument is the replacement for the `import` statements. The third optional argument is the markdown language to embed the example in and will be determined from the example extension if not specified.

Given the documentation section:

```md
## API Method

This method allows to generate documentation.

%EXAMPLE: examples/example.js, ../src => documentary, javascript%`
```

And the example file `examples/example.js`

```js
import documentary from '../src'
import Catchment from 'catchment'

(async () => {
  await documentary()
})()
```

The program will produce the following output:

````
## API Method

This method allows to generate documentation.

```javascript
import documentary from 'documentary'
import Catchment from 'catchment'

(async () => {
  await documentary()
})()
```
````
### Gif Detail

The `GIF` rule will inserts a gif animation inside of a `<detail>` block. To highlight the summary with background color, `<code>` should be used instead of back-ticks. [TOC title link](##toc-titles) also work inside the summary.

```
%GIF doc/doc.gif
Alt: Generating documentation.
Click to View: [<code>yarn doc</code>](t)
%
```

<details>
  <summary>Click to View: <a name="yarn-doc"><code>yarn doc</code></a></summary>
  <table>
  <tr><td>
    <img alt="Alt: Generating documentation." src="doc/doc.gif" />
  </td></tr>
  </table>
</details>
<br>

The actual html placed in the `README` looks like the one below:

```html
<details>
  <summary>Summary of the detail: <code>yarn doc</code></summary>
  <table>
  <tr><td>
    <img alt="Alt: Generating documentation." src="doc/doc.gif" />
  </td></tr>
  </table>
</details>
```
### `Type` Definition

Often, it is required to document a type of an object, which methods can use. To display the information about type's properties in a table, the `TYPE` macro can be used. It allows to show all possible properties that an object can contain, show which ones are required, give examples and link them in the table of contents (disabled by default).

Its signature is as follows:

```
%TYPE addToToc(true|false)
<p name="propertyName" type="propertyType" required>
  <d>Property Description.</d>
  <d>Property Example.</d>
</p>
%
```

For example,

````xml
%TYPE
<p name="text" type="string" required>
  <d>Display text. Required.</d>
  <e>

```js
const q = {
  text: 'What is your name',
}
```
  </e>
</p>
<p name="validation" type="(async) function">
  <d>A function which needs to throw an error if validation does not pass.</d>
  <e>

```js
const q = {
  text: 'What is your name',
  validate(v) {
    if (!v.length) throw new Error('Name is required.')
  },
}
```
  </e>
</p>
%
````

will display the following table:

<table>
  <tr>
    <th>Property</th>
    <th>Type</th>
    <th>Description</th>
    <th>Example</th>
  </tr>
  
<tr>
  <td><strong><code>text</code></strong></td>

  <td><em>string</em></td>
  <td>Display text. Required.</td>
  <td>



```js
const q = {
  text: 'What is your name',
}
```
  
  </td>
</tr>

<tr>
  <td><code>validation</code></td>

  <td><em>(async) function</em></td>
  <td>A function which needs to throw an error if validation does not pass.</td>
  <td>



```js
const q = {
  text: 'What is your name',
  validate(v) {
    if (!v.length) throw new Error('Name is required.')
  },
}
```
  
  </td>
</tr>
</table>

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
### `Toc` Type

`Toc` is a transform stream which can generate a table of contents for incoming markdown data. For every title that the transform sees, it will push the appropriate level of the table of contents.

### `constructor(`<br/>&nbsp;&nbsp;`config?: {`<br/>&nbsp;&nbsp;&nbsp;&nbsp;`skipLevelOne?: boolean = true,`<br/>&nbsp;&nbsp;`},`<br/>`): Toc`

Create a new instance of a `Toc` stream.

```javascript
/* yarn example/toc.js */
import { Toc } from 'documentary'
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
```

```fs
- [Table Of Contents](#table-of-contents)
- [CLI](#cli)
  * [`-j`, `--jsdoc`: Add JSDoc](#-j---jsdoc-add-jsdoc)
- [API](#api)
- [Copyright](#copyright)
```

---

(c) [Art Deco Code][1] 2018

[1]: https://artdeco.bz
