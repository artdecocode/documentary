Documentary
===

[![npm version](https://badge.fury.io/js/documentary.svg)](https://npmjs.org/package/documentary)

<a href="https://github.com/artdecocode/documentary"><img src="images/LOGO.svg?sanitize=true" width="150" align="left"></a>

_Documentary_ is a command-line tool to manage documentation of _Node.JS_ packages of any size. Due to the fact that there is usually a lot of manual labour involved in creating and keeping up-to-date a README document, such as copying examples and the output they produce, there is a need for software that can help automate the process and focus on what is really important, i.e., documenting the features. _Documentary_ serves as a pre-processor of documentation and enhances every area of the task of making available quality docs for Node.JS (and other languages) packages for fellow developers.

```sh
yarn add -D documentary
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/0.svg?sanitize=true">
</a></p>

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

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/1.svg?sanitize=true">
</a></p>

## Table Of Contents

- [Key Features](#key-features)
- [Table Of Contents](#table-of-contents)
- [Installation & Usage](#installation--usage)
- [Wiki](#wiki)
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
- [♫ PRO<br/>♪ Underlined<br/>♯ `Titles`](#-pro-underlined-titles)
- [Glossary](#glossary)
  * [Online Documentation](#online-documentation)
  * [Editor Documentation](#editor-documentation)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/2.svg?sanitize=true">
</a></p>

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

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/3.svg?sanitize=true">
</a></p>

## Wiki

Each feature of _Documentary_ is described on its relevant Wiki page.

- <kbd>📖[Tables Of Content](../../wiki/Tables-Of-Content)</kbd>: Creating a navigation menu for the README page.
- <kbd>⚜️[Section Breaks](../../wiki/Section-Breaks)</kbd>: Placing visual separators of sections.
- <kbd>📐[JSON Tables](../../wiki/JSON-Tables)</kbd>: Writing _JSON_ array data to be converted into a Markdown table.
- <kbd>📜[Embed Examples](../../wiki/Embed-Examples)</kbd>: Decoupling examples from documentation by maintaining separate runnable example file.
- <kbd>🍴[Forks (Embed Output)](../../wiki/Forks)</kbd>: Executing examples to show their output, and validating that program works correctly.
- <kbd>🎩[Method Titles](../../wiki/Method-Titles)</kbd>: Documenting methods in a standard way.
- <kbd>💍[JSX Components](../../wiki/JSX-Components)</kbd>: Implementing custom system-wide and project-scoped components.
- <kbd>🖱[API](../../wiki/API)</kbd>: Using _Documentary_'s features from other packages.

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/4.svg?sanitize=true">
</a></p>

## **Comments Stripping**

Since comments found in `<!-- comment -->` sections are not visible to users, they will be removed from the compiled output document.

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/5.svg?sanitize=true">
</a></p>

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

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/6.svg?sanitize=true">
</a></p>

## **File Splitting**

_Documentary_ can read a directory and put files together into a single `README` file. The files will be sorted in alphabetical order, and their content merged into a single stream. The `index.md` and `footer.md` are special in this respect, such that the `index.md` of a directory will always go first, and the `footer.md` will go last. To print in reverse order, for example when writing a blog and name files by their dates, the [`--reverse` flag](#reverse-order) can be passed to the CLI.

Example structure used in this documentation:

```m
documentary
├── 1-installation-and-usage
│   └── index.md
├── 2-features
│   ├── 10-type.md
│   ├── 4-comment-stripping.md
│   ├── 4-macros.md
│   ├── 5-file-splitting.md
│   ├── 6-rules.md
│   ├── 8-gif.md
│   ├── 9-typal.md
│   ├── footer.md
│   └── index.md
├── 3-cli.md
├── footer.md
└── index.md
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/7.svg?sanitize=true">
</a></p>

## **Replacement Rules**

There are some other built-in rules for replacements which are listed in this table.


|           Rule           |                                                          Description                                                           |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| %NPM: package-name%      | Adds an NPM badge, e.g., `[![npm version] (https://badge.fury.io/js/documentary.svg)] (https://npmjs.org/package/documentary)`                                                               |
| %TREE directory ...args% | Executes the `tree` command with given arguments. If `tree` is not installed, warns and does not replace the match. |

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/8.svg?sanitize=true">
</a></p>

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

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/9.svg?sanitize=true">
</a></p>

## **_Typal_: Smart Typedefs**

[_Typal_](https://artdecocode.com/typal/) is a package to manage JSDoc typedefs from a separate `types.xml` file (or files). They can then be placed into JavaScript, used to generate _Google Closure Compiler_ externs and embedded into documentation with _Documentary_. When placed in JS, one of the advantages is that it allows to expand function parameters' properties, so that they are better visible from the IDE:

![Preview Of The Configure Function](doc/typedef-config.gif)

The main use of _Typal_ is together with _Documentary_ to insert tables with types' descriptions.

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/10.svg?sanitize=true" width="20">
</a></p>

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

[`import('http').ServerResponse`](https://nodejs.org/api/http.html#http_class_http_serverresponse) __<a name="type-httpserverresponse">`http.ServerResponse`</a>__: A writable stream that communicates data to the client. The second argument of the http.Server.on("request") event.

`(res: ServerResponse) => any` __<a name="type-setheaders">`SetHeaders`</a>__: Function to set custom headers on response.

<code>{ location: string, rights: number }</code> __<a name="type-rightsconfig">`RightsConfig`</a>__: Configuration of read and write access rights.

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

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/11.svg?sanitize=true">
</a></p>

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


<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/12.svg?sanitize=true">
</a></p>



## CLI

The program is used from the CLI (or `package.json` script).

```sh
doc [source] [-o output] [-trwcn] [-p "commit message"] [-h1] [-eg] [-vh]
```

The arguments it accepts are:

<table>
 <thead>
  <tr>
   <th>Argument</th> 
   <th>Short</th>
   <th>Description</th>
  </tr>
 </thead>
  <tr>
   <td>source</td>
   <td></td>
   <td>The documentary file or directory to process. Default <code>documentary</code>.</td>
  </tr>
  <tr>
   <td>--output</td>
   <td>-o</td>
   <td>Where to save the output (e.g., <code>README.md</code>).
    If not passed, prints to <code>stdout</code>.</td>
  </tr>
  <tr>
   <td>--wiki</td>
   <td>-W</td>
   <td>Generate documentation in Wiki mode. The value of the argument must be the location of wiki, e.g., <code>../documentary.wiki</code>. The <code>--output</code> option in this case has no effect.</td>
  </tr>
  <tr>
   <td>--focus</td>
   <td>-f</td>
   <td>When generating <em>Wiki</em>, this is a list of comma-separated values used to specify which pages to process in current compilation, e.g., <code>Address</code> or <code>Address,DNS</code>.</td>
  </tr>
  <tr>
   <td>--toc</td>
   <td>-t</td>
   <td>Just print the table of contents.</td>
  </tr>
  <tr>
   <td>--types</td>
   <td>-T</td>
   <td>The location of types' files which are not referenced in the documentation (e.g., for printing links to external docs).</td>
  </tr>
  <tr>
   <td>--reverse</td>
   <td>-r</td>
   <td>Print files in reverse order. Useful for blogs.</td>
  </tr>
  <tr>
   <td>--h1</td>
   <td>-h1</td>
   <td>Add <code>h1</code> headings to the Table of Contents.</td>
  </tr>
  <tr>
   <td>--watch</td>
   <td>-w</td>
   <td>Watch files for changes and recompile the documentation.</td>
  </tr>
  <tr>
   <td>--no-cache</td>
   <td>-c</td>
   <td>Disable forks' cache for the run. The new output of
    forks will be updated in cache so that it can be used
    next time without <code>-c</code> arg.</td>
  </tr>
  <tr>
   <td>--namespace</td>
   <td>-n</td>
   <td>The root namespace: types within it will not be printed
    with their namespace prefix.</td>
  </tr>
  <tr>
   <td>--push</td>
   <td>-p</td>
   <td>Starts <em>Documentary</em> in watch mode. After changes are
    detected, the commit is undone, and new one is made over
    it, forcing git push.</td>
  </tr>
  <tr>
   <td>--generate</td>
   <td>-g</td>
   <td>[Deprecated] Places typedefs definitions into JavaScript
    files from types.xml. Use <code>typal</code> instead.</td>
  </tr>
  <tr>
   <td>--extract</td>
   <td>-e</td>
   <td>[Deprecated] Migrates existing typedefs from a JavaScript
    file into types.xml. Use <code>typal -m</code> instead.</td>
  </tr>
  <tr>
   <td>--version</td>
   <td>-v</td>
   <td>Prints the current version.</td>
  </tr>
  <tr>
   <td>--help</td>
   <td>-h</td>
   <td>Shows the usage information.</td>
  </tr>
</table>

When <a name="node_debugdoc">`NODE_DEBUG=doc`</a> is set, the program will print processing information, e.g.,

```
DOC 80734: stripping comment
DOC 80734: could not parse the table
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/13.svg?sanitize=true">
</a></p>

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

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/14.svg?sanitize=true">
</a></p>

## Glossary

- **<a name="online-documentation">Online Documentation</a>**: documentation which is accessible online, such as on a GitHub website, or a language reference, e.g., [Node.js Documentation](https://nodejs.org/api/stream.html).
- **<a name="editor-documentation">Editor Documentation</a>**: hints available to the users of an IDE, or an editor, in form of suggestions and descriptive hints on hover over variables' names.

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/-3.svg?sanitize=true">
</a></p>

## Copyright

Section breaks from [FoglihtenDeH0](https://www.1001fonts.com/foglihtendeh0-font.html) font.

<table>
  <tr>
    <th>
      <a href="https://artd.eco">
        <img width="100" src="https://raw.githubusercontent.com/wrote/wrote/master/images/artdeco.png"
          alt="Art Deco">
      </a>
    </th>
    <th>© <a href="https://artd.eco">Art Deco</a>   2019</th>
    <th>
      <a href="https://www.technation.sucks" title="Tech Nation Visa">
        <img width="100" src="https://raw.githubusercontent.com/idiocc/cookies/master/wiki/arch4.jpg"
          alt="Tech Nation Visa">
      </a>
    </th>
    <th><a href="https://www.technation.sucks">Tech Nation Visa Sucks</a></th>
  </tr>
</table>

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/-1.svg?sanitize=true">
</a></p>