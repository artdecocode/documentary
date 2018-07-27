# documentary

[![npm version](https://badge.fury.io/js/documentary.svg)](https://npmjs.org/package/documentary)

`documentary` is a command-line tool and a library to manage documentation of Node.js packages. Due to the fact that complex `README` files are harder to maintain, `documentary` serves as a pre-processor of documentation.

```sh
yarn add -DE documentary
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [Installation & Usage](#installation--usage)
- [Features](#features)
  * [TOC Generation](#toc-generation)
    * [TOC Titles](#toc-titles)
      * [Specific Level](#specific-level)
  * [Tables Display](#tables-display)
  * [Method Title](#method-title)
    * [`async runSoftware(path: string, config: Config): string`](#async-runsoftwarepath-stringconfig-view-containeractions-objectstatic-boolean--truerender-function-string)
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
    * [Dedicated Example Row](#dedicated-example-row)
  * [`@typedef` Generation](#typedef-generation)
    * [`doc src/config-static.js -T`](#doc-srcconfig-staticjs--t)
    * [`README` placement](#readme-placement)
      * [`SetHeaders`](#setheaders)
      * [`StaticConfig`](#staticconfig)
    * [`<import name="Type" from="package" />`](#import-nametype-frompackage-)
  * [`@typedef` Extraction](#typedef-extraction)
    * [`doc src/index.js -e types/index.xml`](#doc-srcindexjs--e-typesindexxml)
- [CLI](#cli)
  * [Output Location](#output-location)
  * [Only TOC](#only-toc)
  * [Insert Types](#insert-types)
  * [Watch Mode](#watch-mode)
  * [Automatic Push](#automatic-push)
  * [`NODE_DEBUG=doc`](#node_debugdoc)
- [API](#api)
  * [`Toc` Stream](#toc-stream)
  * [`TocConfig` Type](#tocconfig-type)
    * [<code>skipLevelOne</code>](#skiplevelone)
  * [`constructor(config?: TocConfig): Toc`](#constructorconfig-skiplevelone-boolean--true-toc)
- [Glossary](#glossary)
  * [Online Documentation](#online-documentation)
  * [Editor Documentation](#editor-documentation)
- [Copyright](#copyright)

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

It is possible to generate neat titles useful for API documentation with `documentary`. The method signature should be specified as a `JSON` array, where every member is an argument specified as an array. The first item in the argument array is the argument name, and the second one is type. Type can be either a string, or an object. If it is an object, each value in the object will be an array and first contain the property type, secondly - the default value. To mark a property as optional, the `?` symbol can be used at the end. The third item is the short name for the table of contents (so that a complex object can be referenced to its type).

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
  }, "Config"]
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
documentary
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
│   ├── 91-types-xml.md
│   ├── 92-types-extraction.md
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

```xml
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
 <thead>
  <tr>
   <th>Property</th>
   <th>Type</th>
   <th>Description</th>
   <th>Example</th>
  </tr>
 </thead>
 <tbody>
  <tr>
   <td><strong><code>text*</code></strong></td>
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
 </tbody>
</table>


When required to use the markdown syntax in tables (such as `__`, links, _etc_), an extra space should be left after the `d` or `e` tags like so:

```xml
%TYPE true
<p name="skipLevelOne" type="boolean">
  <d>

Start the table of contents from level 2, i.e., excluding the `#` title.</d>
</p>
%
```

Otherwise, the content will not be processed by `GitHub`. However, it will add an extra margin to the content of the cell as it will be transformed into a paragraph.

#### Dedicated Example Row

Because examples occupy a lot of space which causes table squeezing on GitHub and scrolling on NPM, `documentary` allows to dedicate a special row to an example. It can be achieved by adding a `row` attribute to the `e` element, like so:

````xml
%TYPE
<p name="headers" type="object">
  <d>Incoming headers returned by the server.</d>
  <e row>

```json
{
  "server": "GitHub.com",
  "content-type": "application/json",
  "content-length": "2",
  "connection": "close",
  "status": "200 OK"
}
```
  </e>
</p>
%
````

In addition, any properties which do not contain examples will not have an example column at all.

<table>
 <thead>
  <tr>
   <th>Property</th>
   <th>Type</th>
   <th>Description</th>
   <th>Example</th>
  </tr>
 </thead>
 <tbody>
  <tr>
   <td><code>body</code></td>
   <td><em>string|object|Buffer</em></td>
   <td colspan="2">The return from the server.</td>
  </tr>
  <tr>
   <td><code>headers</code></td>
   <td><em>object</em></td>
   <td colspan="2">Incoming headers returned by the server.</td>
  </tr>
  <tr></tr>
  <tr>
   <td colspan="4">

```json
{
  "server": "GitHub.com",
  "content-type": "application/json",
  "content-length": "2",
  "connection": "close",
  "status": "200 OK"
}
```
  </td>
  </tr>
  <tr>
   <td><code>statusCode</code></td>
   <td><em>number</em></td>
   <td>The status code returned by the server.</td>
   <td><code>200</code></td>
  </tr>
 </tbody>
</table>


Finally, when no examples which are not rows are given, there will be no `Example` heading.

````xml
%TYPE
<p name="data" type="object">
  <d>Optional data to send to the server with the request.</d>
  <e row>

```js
{
  name: 'test',
}
```
  </e>
</p>
<p name="method" type="string">
  <d>What HTTP method to use to send data (only works when <code>data</code> is set).</d>
</p>
%
````

<table>
 <thead>
  <tr>
   <th>Property</th>
   <th>Type</th>
   <th>Description</th>
  </tr>
 </thead>
 <tbody>
  <tr>
   <td><code>data</code></td>
   <td><em>object</em></td>
   <td>Optional data to send to the server with the request.</td>
  </tr>
  <tr></tr>
  <tr>
   <td colspan="3">

```js
{
  name: 'test',
}
```
  </td>
  </tr>
  <tr>
   <td><code>method</code></td>
   <td><em>string</em></td>
   <td>What HTTP method to use to send data (only works when <code>data</code> is set).</td>
  </tr>
 </tbody>
</table>


### `@typedef` Generation

For the purpose of easier maintenance of `JSDoc` `@typedef` declarations, `documentary` allows to keep them in a separate xml file, and then place the compiled versions into both source code as well as documentation. By doing this, more flexibility is achieved as types are kept in one place but can be reused for various purposes across multiple files. It is different from _TypeScript_ type declarations as `documentary` will generate a JSDoc rather than type definitions which means that the project does not have to be written in _TypeScript_.

Types are kept in an `xml` file, for example:

```xml
<types>
  <t name="ServerResponse" type="import('http').ServerResponse" noToc />
  <t name="SetHeaders"
    type="(res: ServerResponse) => any"
    desc="Function to set custom headers on response." />
  <t name="StaticConfig" desc="Options to setup `koa-static`.">
    <p string name="root">Root directory string.</p>
    <p opt number name="maxage" default="0">Browser cache max-age in milliseconds.</p>
    <p opt boolean name="hidden" default="false">Allow transfer of hidden files.</p>
    <p opt string name="index" default="index.html">Default file name.</p>
    <p opt type="SetHeaders" name="setHeaders">Function to set custom headers on response.</p>
  </t>
</types>
```

Here, `import('http').ServerResponse` is a feature of _TypeScript_ that allows to reference an external type in VS Code. It does not require the project to be written in _TypeScript_, but will enable correct IntelliSense completions and hits (available since VS Code at least `1.25`).

To place the compiled declaration into a source code, the following line should be placed in the `.js` file (where `types/static.xml` file existing in the project directory from which `doc` will be run):

```js
/* documentary types/static.xml */
```

```js
/* src/config-static.js */
import Static from 'koa-static'

/**
 * Configure the middleware.
 * @param {StaticConfig} config
 */
function configure(config) {
  const middleware = Static(config)
  return middleware
}

/* documentary types/static.xml */

export default configure
```

> Please note that the types marker must be placed before `export default` is done (or just `export`) as there's currently a bug in VS Code.

The JavaScript file is then processed with <a name="doc-srcconfig-staticjs--t">`doc src/config-static.js -T`</a> command. After the processing is done, the `.js` file will be transformed to include all types specified in the XML file. On top of that, _JSDoc_ for any method that has an included type as one of its parameters will be updated to its expanded form so that a preview of options is available. This routine can be repeated whenever types are updated.

```js
/* yarn example/typedef.js */
import Static from 'koa-static'

/**
 * Configure the middleware.
 * @param {StaticConfig} config Options to setup `koa-static`.
 */
function configure(config) {
  const middleware = Static(config)
  return middleware
}

/* documentary types/static.xml */
/**
 * @typedef {import('http').ServerResponse} ServerResponse
 * @typedef {(res: ServerResponse) => any} SetHeaders Function to set custom headers on response.
 * @typedef {Object} StaticConfig Options to setup `koa-static`.
 * @prop {string} root Root directory string.
 * @prop {number} [maxage=0] Browser cache max-age in milliseconds. Default `0`.
 * @prop {boolean} [hidden=false] Allow transfer of hidden files. Default `false`.
 * @prop {string} [index="index.html"] Default file name. Default `index.html`.
 * @prop {SetHeaders} [setHeaders] Function to set custom headers on response.
 */

export default configure
```

The `StaticConfig` type will be previewed as:

![preview of the StaticConfig](doc/typedef-Type.gif)

And the `configure` function will be seen as:

![preview of the configure function](doc/typedef-config.gif)

#### `README` placement

To place a type definition as a table into a `README` file, the `TYPEDEF` snippet can be used, where the first argument is the path to the `xml` file containing definitions, and the second one is the name of the type to embed. Moreover, links to the type descriptions will be created in the table of contents using the [__TOC Titles__](#toc-titles), but to prevent this, the `noToc` attribute should be set for a type.

```
%TYPEDEF path/definitions.xml TypeName%
```

For example, using previously defined `StaticConfig` type from `types/static.xml` file, `documentary` will process the following markers:

```
%TYPEDEF types/static.xml ServerResponse%
%TYPEDEF types/static.xml SetHeaders%
%TYPEDEF types/static.xml StaticConfig%
```

or a single marker to include all types in order in which they appear in the `xml` file (doing this also allows to reference other types from properties):

```
%TYPEDEF types/static.xml%
```

and embed resulting type definitions:

`import('http').ServerResponse` __`ServerResponse`__

`(res: ServerResponse) => any` __<a name="setheaders">`SetHeaders`</a>__: Function to set custom headers on response.

__<a name="staticconfig">`StaticConfig`</a>__: Options to setup `koa-static`.

| Name | Type | Description | Default |
| ---- | ---- | ----------- | ------- |
| __root*__ | _string_ | Root directory string. | - |
| maxage | _number_ | Browser cache max-age in milliseconds. | `0` |
| hidden | _boolean_ | Allow transfer of hidden files. | `false` |
| index | _string_ | Default file name. | `index.html` |
| setHeaders | [_SetHeaders_](#setheaders) | Function to set custom headers on response. | - |

#### `<import name="Type" from="package" />`

A special `import` element can be used to import a Type using Visual Code's TypeScript engine. An import looks like `/** @typedef {import('package').Type} Type */`, so that `name` attribute is the name of the type in the referenced package, and `from` attribute is the name of the module from which to import the type. This makes it easier to reference the external type later in the file. However, it is not supported in older versions of _VS Code_.

%EXAMPLE: test/fixtures/typedef/generate-import.js, ../src => src, js%

```xml

```

### `@typedef` Extraction

A JavaScript file can be scanned for the presence of `@typedef` JSDoc comments, and then extracted to a `types.xml` file. This can be done with the <a name="doc-srcindexjs--e-typesindexxml">`doc src/index.js -e types/index.xml`</a> command. This is primarily a tool to migrate older software to using `types.xml` files which can be used both for [online documentation](#online-documentation) and [editor documentation](#editor-documentation).

For example, types can be extracted from a JavaScript file which contains JSDoc in form of comments:

```js
async function test() {
  process.stdout.write('ttt')
}

/**
 * @typedef {Object} Test This is test description.
 * @typedef {Object} SessionConfig Description of Session Config.
 * @prop {string} key cookie key.
 * @prop {number|'session'} [maxAge=86400000] maxAge in ms. Default is 1 day. `session` will result in a cookie that expires when session/browser is closed. Warning: If a session cookie is stolen, this cookie will never expire. Default `86400000`.
 * @prop {boolean} [overwrite] Can overwrite or not. Default `true`.
 * @prop {boolean} [httpOnly] httpOnly or not or not. Default `true`.
 * @prop {boolean} [signed=false] Signed or not. Default `false`.
 * @prop {boolean} [rolling] Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. Default `false`.
 * @prop {boolean} [renew] Renew session when session is nearly expired, so we can always keep user logged in. Default `false`.
 */

/**
 * @typedef {Object} Limits
 * @prop {number} [fieldNameSize] Max field name size (Default: 100 bytes).
 * @prop {number} [fieldSize] Max field value size (Default: 1MB).
 * @prop {number} [fields] Max number of non- file fields (Default: Infinity).
 * @prop {number} [fileSize] For multipart forms, the max file size (in bytes)(Default: Infinity).
 * @prop {number} [files] For multipart forms, the max number of file fields (Default: Infinity).
 * @prop {number} [parts] For multipart forms, the max number of parts (fields + files)(Default: Infinity).
 * @prop {number} [headerPairs] For multipart forms, the max number of header key=> value pairs to parse Default: 2000 (same as node's http).
 *
 * @typedef {import('koa-multer').StorageEngine} StorageEngine
 * @typedef {import('http').IncomingMessage} IncomingMessage
 * @typedef {import('koa-multer').File} File
 * @typedef {Object} MulterConfig
 * @prop {string} [dest] Where to store the files.
 * @prop {StorageEngine} [storage] Where to store the files.
 * @prop {(req: IncomingMessage, file: File, callback: (error: Error | null, acceptFile: boolean)) => void} [fileFilter] Function to control which files are accepted.
 * @prop {Limits} [limits] Limits of the uploaded data.
 * @prop {boolean} [preservePath=false]  Keep the full path of files instead of just the base name.
 */

export default test
```

When a description ends with `Default \`true\``, type can also be parsed from there.

```xml
<types>
  <t name="Test" desc="This is test description." />
  <t name="SessionConfig" desc="Description of Session Config.">
    <p string name="key">cookie key.</p>
    <p opt type="number|'session'" name="maxAge" default="86400000">maxAge in ms. Default is 1 day. `session` will result in a cookie that expires when session/browser is closed. Warning: If a session cookie is stolen, this cookie will never expire.</p>
    <p opt boolean name="overwrite" default="true">Can overwrite or not.</p>
    <p opt boolean name="httpOnly" default="true">httpOnly or not or not.</p>
    <p opt boolean name="signed" default="false">Signed or not.</p>
    <p opt boolean name="rolling" default="false">Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown.</p>
    <p opt boolean name="renew" default="false">Renew session when session is nearly expired, so we can always keep user logged in.</p>
  </t>
  <t name="Limits">
    <p opt number name="fieldNameSize">Max field name size (Default: 100 bytes).</p>
    <p opt number name="fieldSize">Max field value size (Default: 1MB).</p>
    <p opt number name="fields">Max number of non- file fields (Default: Infinity).</p>
    <p opt number name="fileSize">For multipart forms, the max file size (in bytes)(Default: Infinity).</p>
    <p opt number name="files">For multipart forms, the max number of file fields (Default: Infinity).</p>
    <p opt number name="parts">For multipart forms, the max number of parts (fields + files)(Default: Infinity).</p>
    <p opt number name="headerPairs">For multipart forms, the max number of header key=> value pairs to parse Default: 2000 (same as node's http).</p>
  </t>
  <t name="StorageEngine" type="import('koa-multer').StorageEngine" />
  <t name="IncomingMessage" type="import('http').IncomingMessage" />
  <t name="File" type="import('koa-multer').File" />
  <t name="MulterConfig">
    <p opt string name="dest">Where to store the files.</p>
    <p opt type="StorageEngine" name="storage">Where to store the files.</p>
    <p opt type="(req: IncomingMessage, file: File, callback: (error: Error | null, acceptFile: boolean)) => void" name="fileFilter">Function to control which files are accepted.</p>
    <p opt type="Limits" name="limits">Limits of the uploaded data.</p>
    <p opt boolean name="preservePath" default="false"> Keep the full path of files instead of just the base name.</p>
  </t>
</types>
```
## CLI

The program is used from the CLI (or `package.json` script).

```sh
doc README-source.md [-o README.md] [-twpT]
```

The arguments it accepts are:

| Flag | Meaning | Description |
| ---- | ------- | ----------- |
| `-o` | <a name="output-location">Output Location</a> | Where to save the processed `README` file. If not specified, the output is written to the `stdout`. |
| `-t` | <a name="only-toc">Only TOC</a> | Only extract and print the table of contents. |
| `-T` | <a name="insert-types">Insert Types</a> | Insert `@typedef` JSDoc into JavaScript files. |
| `-w` | <a name="watch-mode">Watch Mode</a> | Watch mode: re-run the program when changes to the source file are detected. |
| `-p` | <a name="automatic-push">Automatic Push</a> | Watch + push: automatically push changes to a remote git branch by squashing them into a single commit. |

When <a name="node_debugdoc">`NODE_DEBUG=doc`</a> is set, the program will print debug information, e.g.,

```
DOC 80734: stripping comment
DOC 80734: could not parse the table
```
## API

The programmatic use of the `documentary` is intended for developers who want to use this software in their projects.
### `Toc` Stream

`Toc` is a transform stream which can generate a table of contents for incoming markdown data. For every title that the transform sees, it will push the appropriate level of the table of contents.

### `TocConfig` Type

When creating a new `Toc` instance, it will accept the following configuration object.
<table>
 <thead>
  <tr>
   <th>Property</th>
   <th>Type</th>
   <th>Description</th>
   <th>Example</th>
  </tr>
 </thead>
 <tbody>
  <tr>
   <td><a name="skiplevelone"><code>skipLevelOne</code></a></td>
   <td><em>boolean</em></td>
   <td>Start the table of contents from level 2, i.e., excluding the <code>#</code> title.</td>
   <td>For example, the following code:

```md
# Hello World

## Table Of Contents

## Introduction
```

will be compiled to

```md
- [Table Of Contents](#table-of-contents)
- [Introduction](#introduction)
```

when `skipLevelOne` is not set (by default), and to

```md
- [Hello World](#hello-world)
  * [Table Of Contents](#table-of-contents)
  * [Introduction](#introduction)
```

when `skipLevelOne` is set to `false`.
  </td>
  </tr>
 </tbody>
</table>


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

## Glossary

- **<a name="online-documentation">Online Documentation</a>**: documentation which is accessible online, such as on a GitHub website, or a language reference, e.g., [Node.js Documentation](https://nodejs.org/api/stream.html).
- **<a name="editor-documentation">Editor Documentation</a>**: hints available to the users of an IDE, or an editor, in form of suggestions and descriptive hints on hover over variables' names.

## Copyright

(c) [Art Deco][1] 2018

[1]: https://artdeco.bz

