Documentary
===

[![npm version](https://badge.fury.io/js/documentary.svg)](https://npmjs.org/package/documentary)

<a href="https://github.com/artdecocode/documentary"><img src="images/LOGO.svg?sanitize=true" width="150" align="left"></a>

_Documentary_ is a command-line tool to manage documentation of _Node.JS_ packages of any size. Due to the fact that there is usually a lot of manual labour involved in creating and keeping up-to-date a README document, such as copying examples and the output they produce, there is a need for software that can help automate the process and focus on what is really important, i.e., documenting the features. _Documentary_ serves as a pre-processor of documentation and enhances every area of the task of making available quality docs for Node.JS (and other languages) packages for fellow developers.

```sh
yarn add -D documentary
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/0.svg?sanitize=true"></a></p>

## Key Features

This section has a quick look at the best features available in _Documentary_ and how they help the documentation process.

|                 Feature                 |                                                                                                   Description                                                                                                   |                                                                                                                                                                                                                                                                                                                                                        Advantages                                                                                                                                                                                                                                                                                                                                                         |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| *[Tables Of Contents](#toc-generation)* | Compiles an accurate table of contents for the content.                                                                                                                                                         | 1. Makes the structure of the document immediately visible to the reader.<br/>2. Allows to navigate across the page easily.<br/>3. Shows problems with incorrect levels structure which otherwise might not be visible.<br/>4. Allows to place anchor links available from the TOC at any level in any place of the README.<br/>5. Can insert section breaks which visually divide the content and allow to navigate back to the top.                                                                                                                                                                                                                                                                                     |
| *[Examples](#examples-placement)*       | Allows to embed the source code into documentation.                                                                                                                                                             | 1. Increases productivity by eliminating the need to copy and paste the source code manually.<br/>2. Developers can run examples as Node.js scripts to check that they are working correctly and debug them.<br/>3. Examples can also be forked (see below).<br/> 4. It is possible to imports and requires such as `../src` to be displayed as the name of the package.                                                                                                                                                                                                                                                                                                                    |
| *[Forks](#embedding-output)*            | Makes it possible to run an example and embed its `stdout` and `stderr` output directly into documentation. Supports `import` and `export` statements without _Babel_. Allows to save cache for faster re-runs. | 1. Enhances productivity by eliminating the need to copy and paste the output by hand.<br/>2. Makes sure the output is always up-to-date with the documented one.<br/>3. Will make it visible if a change to the code base lead to a different output (implicit regression testing).<br/>4. Supports optional caching, so that programs don't have to be re-run each time a change to documentation in a different place is made.<br/>5. Forked modules can use **import** and **export** statements natively, making it very easy to document the output of examples written in modern syntax.<br/>6. Ensures that examples are actually working.<br/>7. Can print usage of CLI tools by forking them with `-h` command. |
| *[JSX Components](#jsx-components)*     | Performs the compilation of custom-defined JSX components into markdown code.                                                                                                                                   | 1. Lets to define custom components and reuse them across documentation where needed. <br/>2. Provides a modern syntax to combine markdown and JavaScript. <br/>3. When documentation written in HTML files, the components are documented with `web-components.json` file for the VSCode which will provide autosuggestions for the arguments of the component.                                                                                                                                                                                                                                                                                                                                         |
| *[Tables](#simple-tables)*              | Compiles tables from arrays without having to write html or markdown.                                                                                                                                           | 1. Removes the need to manually build tables either by hand, online or using other tools.<br/>2. Provides table macros to reduce repetitive information and substitute only the core data into templates.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| *[Macros](#macros)*                     | Reuses a defined template to place the data into placeholders.                                                                                                                                                  | 1. Removes the need to copy-paste patterns to different places and change data manually.<br/>2. Maintains an up-to-date version of the template without having to change it everywhere.<br/>3. Reduces the cluttering of the source documentation by noise and helps to focus on important information.                                                                                                                                                                                                                                                                                                                                                                                                                   |
| *[Live Push](#automatic-push)*          | Detects changes to the source documentation files, re-compiles the output README.md and pushes to the remote repository.                                                                                        | 1. The preview is available on-line almost immediately after a change is made. <br/>2. Allows to skip writing a commit message and the push command every time a change is made.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| *[Typedefs](#typedef-organisation)*     | Maintains a types.xml file to place types definition in it, available both for source code and documentation.                                                                                                   | 1. Keeps the types declarations in one place, allowing to quickly update it both in JavaScript JSDoc, and in markdown README.<br/>2. Automatically constructs type tables for documentation.<br/>3. Expands the JSDoc config (options) argument for other developers to have a quick glance at possible options when calling a function.<br/>4. Links all types across the whole documentation for quick navigation.<br/>5. If the `types.xml` file or directory is published, other packages can embed it into documentation also, by using _Documentary_.                                                                                                                                    |
| *[API Method Titles](#method-titles)*   | Creates good-looking headers for methods.                                                                                                                                                                       | 1. By writing each argument on new line, makes it easier to understand the signature of a function.<br/>2. Can maintain a separate title for the table of contents to keep things simple there.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/1.svg?sanitize=true"></a></p>

## Table Of Contents

- [Key Features](#key-features)
- [Table Of Contents](#table-of-contents)
- [Installation & Usage](#installation--usage)
- [**TOC Generation**](#toc-generation)
  * [TOC Titles](#toc-titles)
  * [Level TOC Titles](#level-toc-titles)
  * [Section Breaks](#section-breaks)
- [**Simple Tables**](#simple-tables)
  * [Template Macros](#template-macros)
- [**Examples Placement**](#examples-placement)
  * [Partial Examples](#partial-examples)
- [**Embedding Output**](#embedding-output)
  * [Stderr](#stderr)
  * [Caching](#caching)
  * [Import/Exports Support](#importexports-support)
- [**Method Titles**](#method-titles)
  * [`async runSoftware(path: string, config: Config): string`](#async-runsoftwarepath-stringconfig-view-containeractions-objectstatic-boolean--truerender-function-string)
  * [`async runSoftware(path: string)`](#async-runsoftwarepath-string-void)
  * [`runSoftware(): string`](#runsoftware-string)
  * [`runSoftware()`](#runsoftware-void)
- [**JSX Components**](#jsx-components)
  * [Async Components](#async-components)
  * [Built-In Components](#built-in-components)
    * [`<`shell command?=""`>`](#shell-command)
    * [`<`argufy`>`](#argufy)
    * [`<`md2html`>`](#md2html)
- [**Comments Stripping**](#comments-stripping)
- [**Macros**](#macros)
- [**File Splitting**](#file-splitting)
- [**Replacement Rules**](#replacement-rules)
- [**Gif Detail**](#gif-detail)
  * [<code>yarn doc</code>](#yarn-doc)
- [**_Typal_: Smart Typedefs**](#typal-smart-typedefs)
  * [README placement](#readme-placement)
    * [`SetHeaders`](#type-setheaders)
    * [`RightsConfig`](#type-rightsconfig)
    * [`StaticConfig`](#type-staticconfig)
- [**`Type` Definition**](#type-definition)
  * [Dedicated Example Row](#dedicated-example-row)
- [CLI](#cli)
  * [`NODE_DEBUG=doc`](#node_debugdoc)
- [API](#api)
  * [`Toc` Stream](#toc-stream)
  * [`TocConfig` Type](#tocconfig-type)
    * [<code>skipLevelOne</code>](#skiplevelone)
  * [`constructor(config?: TocConfig): Toc`](#constructorconfig-skiplevelone-boolean--true-toc)
- [♫ PRO<br/>♪ Underlined<br/>♯ `Titles`](#-pro-underlined-titles)
- [Glossary](#glossary)
  * [Online Documentation](#online-documentation)
  * [Editor Documentation](#editor-documentation)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/2.svg?sanitize=true"></a></p>

## Installation & Usage

The `doc` client is available after installation. It can be used in a `doc` script of `package.json`, as follows:

```json
{
  "scripts": {
    "doc": "doc documentary -o README.md"
  }
}
```

The first argument, `documentary` is a path to a directory containing source documentation files, or a path to a single file to be processed, e.g., `README-source.md`.

Therefore, to produce an output `README.md`, the following command will be used:

```sh
yarn doc
```

When actively working on documentation, it is possible to use the `watch` mode with `-w` flag, or `-p` flag to also automatically push changes to a remote git repository, merging them into a single commit every time.

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/3.svg?sanitize=true"></a></p>

## **TOC Generation**

Table of contents are useful for navigation in a README document. When a `%TOC%` placeholder is found in the file, it will be replaced with an extracted structure. Titles appearing in comments and code blocks will be skipped.

By default, top level `h1` headers written with `#` are ignored, but they can be added by passing `-h1` [CLI argument](#h1-in-toc).

```markdown
- [Table Of Contents](#table-of-contents)
- [CLI](#cli)
  * [`-j`, `--jsdoc`: Add JSDoc](#-j---jsdoc-add-jsdoc)
- [API](#api)
- [Copyright](#copyright)
```

### TOC Titles

To be able to include a link to a specific position in the text (i.e., create an "anchor"), _Documentary_ has a `TOC Titles` feature. Any text written as `[Toc Title](t)` will generate a relevant position in the table of contents. It will automatically detect the appropriate level and be contained inside the current section.

This feature can be useful when presenting some data in a table in a section, but wanting to include a link to each row in the table of contents so that the structure is immediately visible.

**<a name="level-toc-titles">Level TOC Titles</a>**: if required, the level can be specified with a number of `#` symbols, such as `[Specific Level](###)`.

### Section Breaks

A section break is a small image in the center of the page which indicates the end of a section. With larger sections which also include sub-sections, this feature can help to differentiate when the topic finishes and another one starts. They can also be used to navigate back to the table of contents, or a specified location.

At the moment, there is support for pre-installed section breaks. In future, more support of custom images will be included.

To insert a section brake, the following marker is used:

```
%~[, number[, attributes]]%
```

For example:

```markdown
%~%
%~ 15%
%~ -1%
%~ href="https://hello.world" width="200"%
```

```
<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/0.svg?sanitize=true"></a></p>
<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/15.svg?sanitize=true"></a></p>
<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/-1.svg?sanitize=true"></a></p>
<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/16.svg?sanitize=true" href="https://hello.world" width="200"></a></p>
```

There are 23 available section breaks which will be inserted in incremental order in the document. When the end of the list is reached, the count restarts. There are also 3 ending breaks which can be inserted at the end and do not participate in the rotation, so that they must be inserted manually. To select a specific image, its number can be given.

<table>
 <thead>
  <tr>
   <th>0</th>
   <th>1</th>
   <th>2</th>
   <th>3</th>
   <th>4</th>
   <th>5</th>
   <th>6</th>
   <th>7</th>
   <th>8</th>
   <th>9</th>
   <th>10</th>
   <th>11</th>
  </tr>
 </thead>
 <tbody>
  <tr/>
  <tr>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/0.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/1.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/2.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/3.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/4.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/5.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/6.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/7.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/8.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/9.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/10.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/11.svg?sanitize=true"></td>
  </tr>
  <tr>
   <td align="center"><strong>12</strong></td>
   <td align="center"><strong>13</strong></td>
   <td align="center"><strong>14</strong></td>
   <td align="center"><strong>15</strong></td>
   <td align="center"><strong>16</strong></td>
   <td align="center"><strong>17</strong></td>
   <td align="center"><strong>18</strong></td>
   <td align="center"><strong>19</strong></td>
   <td align="center"><strong>20</strong></td>
   <td align="center"><strong>21</strong></td>
   <td align="center"><strong>22</strong></td>
  </tr>
  <tr>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/12.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/13.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/14.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/15.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/16.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/17.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/18.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/19.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/20.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/21.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/22.svg?sanitize=true"></td>
  </tr>
 </tbody>
</table>

<table>
 <thead>
  <tr>
   <th>-1</th>
   <th>-2</th>
   <th>-3</th>
  </tr>
 </thead>
 <tbody>
  <tr/>
  <tr>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/-1.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/-2.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/-3.svg?sanitize=true"></td>
  </tr>
 </tbody>
</table>

By default, the section brake will link to the table of contents, however this can be changed by setting the `href` attribute. The images are also SVGs therefore it is possible to give them any width via the `width` attribute and they will stretch without any loss of quality. _Documentary_ will copy images from its source code to the `.documentary/section-breaks` directory in the repository. To control the destination, set the `to` attribute on section breaks.

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/4.svg?sanitize=true"></a></p>

## **Simple Tables**

One of the most common problem with markdown is that it is hard to write tables. They must be written either as html, or as markdown, which is troublesome and requires effort. Although there are online tools to build markdown tables, with _Documentary_ the process is even simpler: the data just needs to be put into a JSON array.

To describe tabular data (for example, a CLI tool arguments) in a table, but prepare them in a more readable format, _Documentary_ allows to write code blocks with the `table` language to be converted into a markdown table. The content of the blocks must be in `JSON` format and contain a single array of arrays which represent rows.

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

### Template Macros

Whenever there's a pattern for presenting data in a table, such as that input fields can be mapped to output columns, a table macro can be defined. The example below defines a macro to print a row containing a link, logo and description of a company. It is then used in a table, where only the actual values are entered, relying on _Documentary_ to substitute them in the template.

````markdown
%TABLE-MACRO Company
  <a href="$2">![$1 Logo](images/logos/$3)</a>, $4, $5\, $6
%

```table Company
[
  ["Company", "Tag Line", "Evaluation & Exit"],
  [
    "VWO", "https://vwo.com", "vwo.png", "A/B Testing and Conversion Optimization Platform™", "$10m", "2018"
  ]
]
```
````

```markdown
|                             Company                             |                     Tag Line                      | Evaluation & Exit |
| --------------------------------------------------------------- | ------------------------------------------------- | ----------------- |
| <a href="https://vwo.com">![VWO Logo](images/logos/vwo.png)</a> | A/B Testing and Conversion Optimization Platform™ | $10m, 2018        |
```

The values in the macro need to be separated with `,` which allows to substitute them into the correct column of the table row. When a `,` needs to be used as part of the column in the macro, it can be escaped with `\` such as `\,` as shown in the last column of the example.

| Company | Tag Line | Evaluation & Exit |
| ------- | -------- | ----------------- |
| <a href="https://vwo.com">![VWO Logo](images/logos/vwo.png)</a> | A/B Testing and Conversion Optimization Platform™ | $10m, 2018 |

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/5.svg?sanitize=true"></a></p>

## **Examples Placement**

_Documentary_ can be used to embed examples into the documentation. The example file needs to be specified with the following marker:

```
%EXAMPLE: example/example.js [, ../src => documentary] [, javascript]%
```

The first argument is the path to the example relative to the working directory of where the command was executed (normally, the project folder). The second optional argument is the replacement for the `import` statements (or `require` calls). The third optional argument is the markdown language to embed the example in and will be determined from the example extension if not specified.

Given the documentation section:

```markdown
## API Method

This method allows to generate documentation.

%EXAMPLE: example/example.js, ../src => documentary, javascript%

> JS paths will be resolved automatically:

%EXAMPLE: example/example, ../src => documentary%
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

````markdown
## API Method

This method allows to generate documentation.

```javascript
import documentary from 'documentary'
import Catchment from 'catchment'

(async () => {
  await documentary()
})()
```

> JS paths will be resolved automatically:

```js
import documentary from 'documentary'
import Catchment from 'catchment'

(async () => {
  await documentary()
})()
```
````

### Partial Examples

Whenever only a part of an example needs to be shown (but the full code is still needed to be able to run it), _Documentary_ allows to use `start` and `end` comments to specify which part to print to the documentation. It will also make sure to adjust the indentation appropriately.

```js
import documentary from '../src'
import Catchment from 'catchment'

(async () => {
  /* start example */
  await documentary()
  /* end example */
})()
```

```js
await documentary()
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/6.svg?sanitize=true"></a></p>

## **Embedding Output**

When placing examples, it is important to show the output that they produce. This can be achieved using the `FORK` marker.

```t
%FORK(-lang)? module ...args%
```

It will make _Documentary_ fork a _Node.JS_ module using the `child_process.fork` function. The output is printed in a code block, with optionally given language. If the process cleared lines with `\r`, the output will be adjusted to account for that to be displayed like it would be in the terminal. The environment variables will be inherited from the parent `doc` process.

<table>
<thead>
 <tr>
  <th>Markdown</th><th>JavaScript</th>
 </tr>
</thead>
<tbody>
 <tr/>
 <tr>
  <td>

```markdown
The program will output:

%FORK-fs example/fork/fork%
```
  </td>

  <td>

```js
process.stdout.write('...\r')
process.stdout.write('!!\r')
process.stdout.write('?\r\n')
// Display a welcome message.
console.log('HELLO world')
```
  </td>
 </tr>
 <tr>
 <td colspan="2" align="center"><strong>Output<strong></td>
 </tr>
 <tr>
 <td colspan="2">

````
The program will output:

```fs
?!.
HELLO world
```
````
 </td>
 </tr>
</table>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/7.svg?sanitize=true" width="15"></a></p>

### Stderr

By default, the `FORK` marker will print the `stdout` output. To print the `stderr` output, there is the `FORKERR` marker.

```t
%FORKERR(-lang)? module ...args%
```

It works exactly the same as `%FORK%` but will print the output of the process's `stderr` stream.


<table>
<thead>
 <tr>
  <th>Markdown</th><th>JavaScript</th>
 </tr>
</thead>
<tbody>
 <tr/>
 <tr>
  <td>

```markdown
In case of an error, the program will print:

%FORKERR-fs example/fork/fork-stderr%
```
  </td>

  <td>

```js
// Notify of an error.
console.error('An error has occurred.')
```
  </td>
 </tr>
 <tr>
 <td colspan="2" align="center"><strong>Output<strong></td>
 </tr>
 <tr>
 <td colspan="2">

````
In case of an error, the program will print:

```fs
An error has occurred.
```
````
 </td>
 </tr>
</table>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/8.svg?sanitize=true" width="15"></a></p>

### Caching

The output of forks will be cached in the `.documentary/cache` directory. When compiling documentation, _Documentary_ will check for the presence of cache, check the _mtime_ of the module and if it is the same as cached, analyse module's dependencies to see if any of them had changes (updates to package dependencies' versions, changes to source files). When the cache is matched, no forking will take place and the value will be taken from the saved outputs. To explicitly prevent caching on a particular _FORK_ marker, it should be prefixed with `!`: `%!FORK module arg1 arg2%`. To disable caching across all _forks_, the [`-c`](#disable-cache) option can be passed to the CLI. Even if cache is disabled, the output will be saved so that when _Documentary_ is run next time, the latest known output is placed instantly.

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/9.svg?sanitize=true" width="15"></a></p>

### Import/Exports Support

_Documentary_ is able to fork modules that use `import` and `export` without the developer having to write a proxy file that would otherwise require `@babel/register`. It was made possible with _ÀLaMode_ regex-based transpiler that will update the `import/export` statements on-the-fly. If there are any problems while using this feature, it can be disabled with the `_` symbol: `%_FORK module arg1 arg2%`.

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/10.svg?sanitize=true"></a></p>

## **Method Titles**

_Documentary_ can generate neat titles useful for API documentation. The method signature should be specified in a `JSON` array, where every member is an argument written as an array containing its name and type. The type can be either a string, or an object.

For object types, each value is an array which contains the property type and its default value. To mark a property as optional, the `?` symbol can be used at the end of the key.

The last item in the argument array is used when the argument is an object and is a short name to be place in the table of contents (so that a complex object can be referenced to its type).

### `async runSoftware(`<br/>&nbsp;&nbsp;`path: string,`<br/>&nbsp;&nbsp;`config: {`<br/>&nbsp;&nbsp;&nbsp;&nbsp;`View: Container,`<br/>&nbsp;&nbsp;&nbsp;&nbsp;`actions: object,`<br/>&nbsp;&nbsp;&nbsp;&nbsp;`static?: boolean = true,`<br/>&nbsp;&nbsp;&nbsp;&nbsp;`render?: function,`<br/>&nbsp;&nbsp;`},`<br/>`): string`

Generated from

````m
```### async runSoftware => string
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

### `async runSoftware(`<br/>&nbsp;&nbsp;`path: string,`<br/>`): void`

Generated from

````m
```### async runSoftware
[
  ["path", "string"]
]
```
````

### `runSoftware(): string`

Generated from

````m
```### runSoftware => string
```
````


### `runSoftware(): void`

Generated from

````m
```### runSoftware
```
````

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/11.svg?sanitize=true"></a></p>

## **JSX Components**

_Documentary_ lets users define their custom components in the `.documentary` folder both in the project directory and the user's home directory. The components are written using JSX syntax and exported as named functions from `jsx` files. The properties the component receives are extracted from the markdown syntax and passed to the hyperscript constructor (from `preact`).

For example, the user can define their own component in the following way:

```jsx
import read from '@wrote/read'

/**
 * Display the sponsor information.
 */
export const Sponsor = ({
  name, link, image, children,
}) => {
  return <table>
  <tr/>
  <tr>
    <td align="center">
      <a href={link}>
        <img src={image} alt={name}/>
      </a><br/>
      Sponsored by <a href={link}>{name}</a>.
    </td>
  </tr>
  {children && <tr><td>{children}</td></tr>}
</table>
}

/**
 * The async component to print the source of the document.
 */
export const Source = async ({ src }) => {
  const res = await read(src)
  const e = src.split('.')
  const ext = e[e.length - 1]
  return `\`\`\`${ext}
${res}
\`\`\``
}
```

And then invoke it in the documentation:

```html
<Sponsor name="Tech Nation Visa Sucks"
         link="https://www.technation.sucks"
         image="sponsor.gif">
Get In Touch To Support Documentary
</Sponsor>
```

The result will be rendered HTML:

<table>
  <tr></tr>
  <tr>
    <td align="center">
      <a href="https://www.technation.sucks">
        <img src="https://raw.githubusercontent.com/artdecoweb/www.technation.sucks/master/anim.gif"
          alt="Tech Nation Visa Sucks" />
      </a>
      <br />
      Sponsored by 
      <a href="https://www.technation.sucks">Tech Nation Visa Sucks</a>
      .
    </td>
  </tr>
  <tr><td>
  Get In Touch To Support Documentary

  </td>
  </tr>
</table>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/12.svg?sanitize=true" width="15"></a></p>

### Async Components

The components can be rendered asynchronously when the component returns a promise. _Documentary_ will wait for the promise to resolve before attempting to render JSX into HTML. Only the root component can be asynchronous, and if it uses other components in its JSX, they must be synchronous.

```js
<Source src="src/index.js" />
```

If a component returns just a string without actually using JSX, then it is pasted into the code as is, see the `Source` example.

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/13.svg?sanitize=true" width="15"></a></p>

<h3>Web Components</h3>

To receive access to the autosuggestions powered by _VSCode's_ `customData` implementation of web-components.json standard, documentation files need to be written in HTML file format, and the `.vscode/settings.json` has to be updated to include the `html.experimental.customData` property as shown below:

```json5
{
  "html.experimental.customData": [
    "./node_modules/documentary/web-components.json"
  ]
}
```

Then, _Documentary_'s components will be available when pressing CMD + SPACE in the editor.

```html
<shell command="echo" language="fs">
  HELLO WORLD!
  EXAMPLE !@£
</shell>
```


```sh
$ echo "HELLO WORLD!" "EXAMPLE !@£"
```

```fs
HELLO WORLD! EXAMPLE !@£
```



<a href="doc/shell.gif" title="Open GIF"><img src="doc/language.png" alt="The Shell Component Autosuggestions In Documentary" width="400">
<br>Open Gif
</a>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/14.svg?sanitize=true" width="15"></a></p>

### Built-In Components

There are a number of built-in components at the moment.

#### `<`shell command?=""`>`

Either uses `spawn` to spawn a command and pass arguments to it, or `exec` to get the result of a more complex operations such as piping to other commands reachable from shell.

Usage:

```jsx
<shell command="echo"/>
<shell command="echo">ABC</shell>
<shell command="echo">
  Hello World
  example123
</shell>

<shell>
  (echo abc; sleep 1; echo def; sleep 1; echo ghi) | node consume2.js
</shell>
<shell noTrim>
  (echo abc;) | node consume2.js
</shell>
```

Executes a command as if by the user from the terminal, i.e., `$ echo example` and shows its output after printing the command like

````sh
```{language}
$ {command}
```
```{language = sh}
{output}
```
````

__<a name="type-shellprops">`ShellProps`</a>__: Options for the Shell component. TODO: pass options.

|   Name   |       Type       |                                                                                                Description                                                                                                | Default |
| -------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| command  | <em>string</em>  | The command to execute using the `child_process`. If the command is not passed, the children will be used to pass to `exec`, e.g., `(echo abc; sleep 1; echo def; sleep 1; echo ghi) \| node consume.js`. | -       |
| language | <em>string</em>  | The markdown language of the output.                                                                                                                                                                      | `sh`    |
| err      | <em>boolean</em> | Whether to print STDERR instead of STDOUT (todo: make print both).                                                                                                                                        | `false` |
| children | <em>string</em>  | The arguments to the program each on new line.                                                                                                                                                            | -       |
| noTrim   | <em>boolean</em> | Whether to disable trim before printing the output.                                                                                                                                                       | `false` |

If the command is not passed, the children will be read and executed by the `child_process`._exec_ method. For example, with the following simple receiver:

```js
process.stdin.on('data', d => console.log(`${d}`))
```

The _shell_ component can be used to print output of a complex unix expression. The output will be trimmed before inserting in the documentation. This can be disabled with the `noTrim` option.

```html
<shell>
  (echo abc; sleep 1; echo def; sleep 1; echo ghi) | node test/fixture/node
</shell>
```

<table>
<tr><th>Result Embedded Into README</th></tr>
<tr/>
<tr><td>

```sh
$ (echo abc; sleep 1; echo def; sleep 1; echo ghi) | node test/fixture/node
```

```sh
abc

def

ghi
```

</th></td>
</table>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/15.svg?sanitize=true" width="20"></a></p>

#### `<`argufy`>`

This component is used together with _Argufy_ package which keeps arguments to command-line programs in an XML file, and allows to generate JS to extract them from `process.argv` easily and in _Google Closure Compiler_-compatible way. _Documentary_ allows to place the table with all arguments defined in the `arguments.xml` file by using `<argufy>types/arguments.xml</argufy>` marker. It's child is the location of the arguments file, and if not given, it will default to `types/arguments.xml`. If an `arg` element had `toc` property, it will also be liked to the ToC using a toc-title. [See the table](#cli) generated for _Documentary_ for an example of how the documentation of CLI arguments will look like.

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/16.svg?sanitize=true" width="20"></a></p>

#### `<`md2html`>`

Converts the markdown with `_`/`__`/`*`/`**`/<code>`</code> into html. The main use of this widget is to be able to write tables with markdown and avoid having a whitespace at the bottom of the table row:

```html
<table>
<tr><td>

  `Hello World`: _notice_ the padding at the **bottom** of this row.
</td></tr>
<tr><td>
<md2html>

  `Markdown 2 HTML`: _the text_ has been updated with the **md2html** component.
</md2html>
</td></tr>
</table>
```

<table>
<tr><td>

  `Hello World`: _notice_ the padding at the **bottom** of this row.
</td></tr>
<tr><td>
<code>Markdown 2 HTML</code>: <em>the text</em> has been updated with the <strong>md2html</strong> component.
</td></tr>
</table>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/17.svg?sanitize=true"></a></p>



## **Comments Stripping**

Since comments found in `<!-- comment -->` sections are not visible to users, they will be removed from the compiled output document.

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/18.svg?sanitize=true"></a></p>

## **Macros**

When there this a need to present some data in a repeatable format, macros can be used. First, a macro needs to be defined with the `MACRO` rule, and then referenced by the `USE-MACRO` rule.

```html
%MACRO example
<details>
<summary>$1</summary>

NPM: _[$1](https://nodejs.tools/$2)_
GitHub: _[$1](https://github.com/artdecocode/$2)_
</details>
%
%USE-MACRO example
<data>Documentary</data>
<data>documentary</data>
%
%USE-MACRO example
<data>Zoroaster</data>
<data>zoroaster</data>
%
```
```html
<details>
<summary>Documentary</summary>

NPM: _[Documentary](https://nodejs.tools/documentary)_
GitHub: _[Documentary](https://github.com/artdecocode/documentary)_
</details>
<details>
<summary>Zoroaster</summary>

NPM: _[Zoroaster](https://nodejs.tools/zoroaster)_
GitHub: _[Zoroaster](https://github.com/artdecocode/zoroaster)_
</details>
```

The data will be substituted with into `$N` placeholders using the `<data>` elements found.

<details>
<summary>Documentary</summary>

NPM: _[Documentary](https://nodejs.tools/documentary)_
GitHub: _[Documentary](https://github.com/artdecocode/documentary)_
</details>
<details>
<summary>Zoroaster</summary>

NPM: _[Zoroaster](https://nodejs.tools/zoroaster)_
GitHub: _[Zoroaster](https://github.com/artdecocode/zoroaster)_
</details>
<br/>

> Currently, a macro can only be defined in the same file as its usage. Also, in future, macros will improve my allowing to use named placeholders.

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/19.svg?sanitize=true"></a></p>

## **File Splitting**

_Documentary_ can read a directory and put files together into a single `README` file. The files will be sorted in alphabetical order, and their content merged into a single stream. The `index.md` and `footer.md` are special in this respect, such that the `index.md` of a directory will always go first, and the `footer.md` will go last. To print in reverse order, for example when writing a blog and name files by their dates, the [`--reverse` flag](#reverse-order) can be passed to the CLI.

Example structure used in this documentation:

```m
documentary
├── 1-installation-and-usage
│   └── index.md
├── 2-features
│   ├── 1-toc.md
│   ├── 1-toc2-section-breaks.md
│   ├── 10-type.md
│   ├── 2-tables.md
│   ├── 3-examples.md
│   ├── 3-fork.md
│   ├── 3-method-title.md
│   ├── 3.5-components
│   │   ├── 1-jsx-components.md
│   │   ├── 1.5async.md
│   │   ├── 2-web-components.html
│   │   ├── 3-components.md
│   │   └── footer.md
│   ├── 4-comment-stripping.md
│   ├── 4-macros.md
│   ├── 5-file-splitting.md
│   ├── 6-rules.md
│   ├── 8-gif.md
│   ├── 9-typal.md
│   └── footer.md
├── 3-cli.md
├── 4-api
│   ├── 1-toc.md
│   └── index.md
├── footer.md
└── index.md
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/20.svg?sanitize=true"></a></p>

## **Replacement Rules**

There are some other built-in rules for replacements which are listed in this table.


|           Rule           |                                                          Description                                                           |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| %NPM: package-name%      | Adds an NPM badge, e.g., `[![npm version] (https://badge.fury.io/js/documentary.svg)] (https://npmjs.org/package/documentary)`                                                              |
| %TREE directory ...args% | Executes the `tree` command with given arguments. If `tree` is not installed, warns and does not replace the match. |

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/21.svg?sanitize=true"></a></p>

## **Gif Detail**

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

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/22.svg?sanitize=true"></a></p>

## **_Typal_: Smart Typedefs**

[_Typal_](https://artdecocode.com/typal/) is a package to manage JSDoc typedefs from a separate `types.xml` file (or files). They can then be placed into JavaScript, used to generate _Google Closure Compiler_ externs and embedded into documentation with _Documentary_. When placed in JS, one of the advantages is that it allows to expand function parameters' properties, so that they are better visible from the IDE:

![Preview Of The Configure Function](doc/typedef-config.gif)

The main use of _Typal_ is together with _Documentary_ to insert tables with types' descriptions.

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/0.svg?sanitize=true" width="20"></a></p>

### README placement

To place a type definition as a table into a `README` file, the `TYPEDEF` marker can be used, where the first argument is the path to the `xml` file containing definitions, and the second one is the name of the type to embed. Moreover, links to the type descriptions will be created in the table of contents using the [__TOC Titles__](#toc-titles), but to prevent this, the `noToc` attribute should be set for a type.

<details>
<summary>Show Types.Xml</summary>

```xml
<types>
  <import name="ServerResponse" from="http"
    link="https://nodejs.org/api/http.html#http_class_http_serverresponse"
  />
  <type name="SetHeaders"
    type="(res: ServerResponse) => any"
    desc="Function to set custom headers on response." />
  <type name="RightsConfig"
    type="{ location: string, rights: number }[]"
    desc="Configuration of read and write access rights." />
  <type name="StaticConfig" desc="Options to setup `koa-static`.">
    <prop string name="root">
      Root directory string.
    </prop>
    <prop number name="maxage" default="0">
      Browser cache max-age in milliseconds.
    </prop>
    <prop boolean name="hidden" default="false">
      Allow transfer of hidden files.
    </prop>
    <prop string name="index" default="index.html">
      Default file name.
    </prop>
    <prop opt type="SetHeaders" name="setHeaders">
      Function to set custom headers on response.
    </prop>
    <prop opt type="Promise.<RightsConfig>" name="rightsPromise">
      The promise which will be resolved with access rights to files.
    </prop>
  </type>
</types>
```
</details>

```
%TYPEDEF path/definitions.xml [TypeName]%
```

For example, using the previously defined `StaticConfig` type from `types/static.xml` file, _Documentary_ will process the following markers:

```
%TYPEDEF types/static.xml ServerResponse%
%TYPEDEF types/static.xml SetHeaders%
%TYPEDEF types/static.xml StaticConfig%
```

or a single marker to include all types in order in which they appear in the `xml` file:

```
%TYPEDEF types/static.xml%
```

and embed resulting type definitions (with the imported type linked to the _Node.JS_ documentation due to its `link` attribute):

[`import('http').ServerResponse`](https://nodejs.org/api/http.html#http_class_http_serverresponse) __<a name="type-httpserverresponse">`http.ServerResponse`</a>__

`(res: ServerResponse) => any` __<a name="type-setheaders">`SetHeaders`</a>__: Function to set custom headers on response.

`{ location: string, rights: number }[]` __<a name="type-rightsconfig">`RightsConfig`</a>__: Configuration of read and write access rights.

__<a name="type-staticconfig">`StaticConfig`</a>__: Options to setup `koa-static`.

|     Name      |                                                             Type                                                             |                           Description                           |   Default    |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ------------ |
| __root*__     | <em>string</em>                                                                                                              | Root directory string.                                          | -            |
| maxage        | <em>number</em>                                                                                                              | Browser cache max-age in milliseconds.                          | `0`          |
| hidden        | <em>boolean</em>                                                                                                             | Allow transfer of hidden files.                                 | `false`      |
| index         | <em>string</em>                                                                                                              | Default file name.                                              | `index.html` |
| setHeaders    | <em><a href="#type-setheaders" title="Function to set custom headers on response.">SetHeaders</a></em>                       | Function to set custom headers on response.                     | -            |
| rightsPromise | <em>Promise&lt;<a href="#type-rightsconfig" title="Configuration of read and write access rights.">RightsConfig</a>&gt;</em> | The promise which will be resolved with access rights to files. | -            |

_Documentary_ wil scan each source file of the documentation first to build a map of all types. Whenever a property appears to be of a known type, it will be automatically linked to the location where it was defined. It is also true for properties described as generic types, such as `Promise<Type>`. This makes it possible to define all types in one place, and then reference them in the API documentation. For the full list of supported types for linking, see [_Typal_'s documentation](https://github.com/artdecocode/typal/#markdown-documentation).

[Read More](doc/typal.md) about types in _Documentary_ including advanced usage with the spread option.

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/1.svg?sanitize=true"></a></p>

## **`Type` Definition**

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

### Dedicated Example Row

Because examples occupy a lot of space which causes table squeezing on GitHub and scrolling on NPM, _Documentary_ allows to dedicate a special row to an example. It can be achieved by adding a `row` attribute to the `e` element, like so:

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


<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/2.svg?sanitize=true"></a></p>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/3.svg?sanitize=true"></a></p>

## CLI

The program is used from the CLI (or `package.json` script).

```sh
doc [source] [-o output] [-trwcn] [-p "commit message"] [-h1] [-eg] [-vh]
```

The arguments it accepts are:

<table>
  <tr><th>Argument</th><th>Short</th><th>Description</th></tr>
  <tr><td>source</td><td></td><td>
    The documentary file or directory to process. Default <code>documentary</code>.
  </td>
  </tr>
  <tr>
    <td>--output</td>
    <td>-o</td>
    <td>
      Where to save the output (e.g., <code>README.md</code>).
          If not passed, prints to <code>stdout</code>.
    </td>
  </tr>
  <tr><td>--toc</td><td>-t</td><td>Just print the table of contents.</td></tr>
  <tr><td>--reverse</td><td>-r</td><td>
    Print files in reverse order. Useful for blogs.
  </td>
  </tr>
  <tr><td>--h1</td><td>-h1</td><td>
    Add <code>h1</code> headings to the Table of Contents.
  </td>
  </tr>
  <tr><td>--watch</td><td>-w</td><td>
    Watch files for changes and recompile the documentation.
  </td>
  </tr>
  <tr>
    <td>--no-cache</td>
    <td>-c</td>
    <td>
      Disable forks' cache for the run. The new output of
          forks will be updated in cache so that it can be used
          next time without <code>-c</code> arg.
    </td>
  </tr>
  <tr>
    <td>--namespace</td>
    <td>-n</td>
    <td>
      The root namespace: types within it will not be printed
          with their namespace prefix.
    </td>
  </tr>
  <tr>
    <td>--push</td>
    <td>-p</td>
    <td>
      Starts <em>Documentary</em> in watch mode. After changes are
          detected, the commit is undone, and new one is made over
          it, forcing git push.
    </td>
  </tr>
  <tr>
    <td>--generate</td>
    <td>-g</td>
    <td>
      [Deprecated] Places typedefs definitions into JavaScript
          files from types.xml. Use <code>typal</code> instead.
    </td>
  </tr>
  <tr>
    <td>--extract</td>
    <td>-e</td>
    <td>
      [Deprecated] Migrates existing typedefs from a JavaScript
          file into types.xml. Use <code>typal -m</code> instead.
    </td>
  </tr>
  <tr><td>--version</td><td>-v</td><td>Prints the current version.</td></tr>
  <tr><td>--help</td><td>-h</td><td>Shows the usage information.</td></tr>
</table>

When <a name="node_debugdoc">`NODE_DEBUG=doc`</a> is set, the program will print processing information, e.g.,

```
DOC 80734: stripping comment
DOC 80734: could not parse the table
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/4.svg?sanitize=true"></a></p>

## API

The programmatic use of _Documentary_ is intended for developers who want to use this software in their projects.

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

```markdown
# Hello World

## Table Of Contents

## Introduction
```

will be compiled to

```markdown
- [Table Of Contents](#table-of-contents)
- [Introduction](#introduction)
```

when `skipLevelOne` is not set (by default), and to

```markdown
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

```js
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

```markdown
- [Table Of Contents](#table-of-contents)
- [CLI](#cli)
  * [`-j`, `--jsdoc`: Add JSDoc](#-j---jsdoc-add-jsdoc)
- [API](#api)
- [Copyright](#copyright)
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/5.svg?sanitize=true"></a></p>

♫ PRO
♪ Underlined
♯ `Titles`
---

Titles written as blocks and underlined with any number of either `===` (for H1) and `---` (for H2), will be also displayed in the table of contents. However, the actual title will appear on a single line.

```markdown
♫PRO
♪Underlined
♯ `Titles`
---
```

As seen in the [_Markdown Cheatsheet_](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet).

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/6.svg?sanitize=true"></a></p>

## Glossary

- **<a name="online-documentation">Online Documentation</a>**: documentation which is accessible online, such as on a GitHub website, or a language reference, e.g., [Node.js Documentation](https://nodejs.org/api/stream.html).
- **<a name="editor-documentation">Editor Documentation</a>**: hints available to the users of an IDE, or an editor, in form of suggestions and descriptive hints on hover over variables' names.

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/-3.svg?sanitize=true"></a></p>

## Copyright

Section breaks from [FoglihtenDeH0](https://www.1001fonts.com/foglihtendeh0-font.html) font.

<table>
  <tr>
    <th>
      <a href="https://artd.eco">
        <img src="https://raw.githubusercontent.com/wrote/wrote/master/images/artdeco.png" alt="Art Deco" />
      </a>
    </th>
    <th>© <a href="https://artd.eco">Art Deco</a>   2019</th>
    <th>
      <a href="https://www.technation.sucks" title="Tech Nation Visa">
        <img src="https://raw.githubusercontent.com/artdecoweb/www.technation.sucks/master/anim.gif"
          alt="Tech Nation Visa" />
      </a>
    </th>
    <th><a href="https://www.technation.sucks">Tech Nation Visa Sucks</a></th>
  </tr>
</table>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/-1.svg?sanitize=true"></a></p>