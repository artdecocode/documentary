Documentary
===

[![npm version](https://badge.fury.io/js/documentary.svg)](https://www.npmjs.com/package/documentary)

<a href="https://github.com/artdecocode/documentary"><img src="images/LOGO.svg?sanitize=true" width="150" align="left"></a>

_Documentary_ is a command-line tool to manage documentation of _Node.JS_ packages of any size. Due to the fact that there is usually a lot of manual labour involved in creating and keeping up-to-date a README document, such as copying examples and output they produce, there is a need for software that can help automate the process and focus on what is really important, i.e., documenting features. _Documentary_ serves as a pre-processor of documentation and enhances every area of the task of making available high-quality docs for _Node.JS_ (and other languages) packages for fellow developers.

```sh
yarn add -D documentary
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/0.svg?sanitize=true">
</a></p>

For example, these are some pieces of documentation infrastructure made available by _Documentary_:
````html
<!-- Tables Of Contents -->
%TOC%

<!-- Examples with paths renaming -->
%EXAMPLE: example/index.js, ../src => documentary%

<!-- Forks, native with import/export/jsx -->
<fork stderr nocache env="HELLO=WORLD">
  example/index.js
</fork>

<!-- Typedefs with linking -->
<typedef narrow flatten>
  types/index.xml
</typedef>

<!-- Methods with custom heading designs -->
```## runSoftware
[
  ["program", "string"],
  ["config=", "Object"]
]
```

<!-- Section Breaks -->
%~ width="25"%

<!-- JSX Components -->
<my-component package="documentary">
  Checkout https://readme.page
</my-component>
````
All of these features come with just 3 transient dependencies in your `node_modules`:

```m
../documentary-test/node_modules
├── alamode
├── documentary
├── preact
└── typal
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/1.svg?sanitize=true">
</a></p>

<table>
<tr><td rowspan="2">

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [Wiki](#wiki)
- [Installation & Usage](#installation--usage)
- [Misc](#misc)
  * [Comments Stripping](#comments-stripping)
  * [File Splitting](#file-splitting)
  * [Replacement Rules](#replacement-rules)
- [CLI](#cli)
  * [`NODE_DEBUG=doc`](#node_debugdoc)
  * [Hidden Files](#hidden-files)
- [♫ PRO<br/>♪ Underlined<br/>♯ `Titles`](#-pro-underlined-titles)
- [Glossary](#glossary)
  * [Online Documentation](#online-documentation)
  * [Editor Documentation](#editor-documentation)
- [Copyright](#copyright)

</td>
</tr><tr>
<td rowspan="2">

## Wiki

Each feature of _Documentary_ is described on its relevant Wiki page.

- <kbd>⭐️[Key Features](../../wiki/Key-Features)</kbd>: A quick overview of the solutions provided by _Documentary_ for developers to make writing documentation a breeze.
- <kbd>📖[Tables Of Content](../../wiki/Tables-Of-Contents)</kbd>: Creating a navigation menu for the README page.
- <kbd>⚜️[Section Breaks](../../wiki/Section-Breaks)</kbd>: Placing visual separators of sections.
- <kbd>📐[JSON Tables](../../wiki/JSON-Tables)</kbd>: Writing _JSON_ array data to be converted into a Markdown table.
- <kbd>📜[Embed Examples](../../wiki/Embed-Examples)</kbd>: Decoupling examples from documentation by maintaining separate runnable example file.
- <kbd>🍴[Forks (Embed Output)](../../wiki/Forks)</kbd>: Executing examples to show their output, and validating that program works correctly.
- <kbd>🎩[Method Titles](../../wiki/Method-Titles)</kbd>: Documenting methods in a standard way, and provide your own designs.
- <kbd>🎇[JSX Components](../../wiki/JSX-Components)</kbd>: Implementing custom system-wide and project-scoped components.
- <kbd>🤖[Macros](../../wiki/Macros)</kbd>: Constructing patterns to be reused in formation of READMEs.
- <kbd>☀️[Typedefs](../../wiki/Typedefs)</kbd>: Display `@typedef` information in _README_ files by maintaining types externally to _JS_ source.
- <kbd>🎼[Type (Deprecated)](../../wiki/Type-(Deprecated))</kbd>: An older version of typedefs which works as a macro for types.
- <kbd>🥠[Gif Detail](../../wiki/Gif-Detail)</kbd>: Hiding images inside of the `<details>` block.
- <kbd>🖱[API](../../wiki/API)</kbd>: Using _Documentary_'s features from other packages.

</td></tr>
</table>

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

## Misc

These are some essential feature of _Documentary_.

### Comments Stripping

Since comments found in `<!-- comment -->` sections are not visible to users, they will be removed from the compiled output document.

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/4.svg?sanitize=true">
</a></p>

### File Splitting

_Documentary_ can read a directory and put files together into a single `README` file. The files will be sorted in alphabetical order, and their content merged into a single stream. The `index.md` and `footer.md` are special in this respect, such that the `index.md` of a directory will always go first, and the `footer.md` will go last. To print in reverse order, for example when writing a blog and name files by their dates, the [`--reverse` flag](#reverse-order) can be passed to the CLI.

Example structure used in this documentation:

```m
documentary
├── 1-installation-and-usage
│   └── index.md
├── 2-features
│   ├── 4-comment-stripping.md
│   ├── 5-file-splitting.md
│   ├── 6-rules.md
│   └── index.md
├── 3-cli.md
├── footer.md
└── index.md
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/5.svg?sanitize=true">
</a></p>

### Replacement Rules

There are some other built-in rules for replacements which are listed in this table.


|           Rule           |                                                          Description                                                           |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| %NPM: package-name%      | Adds an NPM badge, e.g., `[![npm version] (https://badge.fury.io/js/documentary.svg)] (https://npmjs.org/package/documentary)`                                                               |
| %TREE directory ...args% | Executes the `tree` command with given arguments. If `tree` is not installed, warns and does not replace the match. |

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/6.svg?sanitize=true">
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
   <td>When generating <em>Wiki</em>, this is a list of comma-separated values that will be converted into RegEx'es used to specify which pages to process in current compilation, e.g., <code>Address</code>, <code>Addr</code> or <code>Address,DNS</code>.</td>
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
   <td>--debug</td>
   <td>-d</td>
   <td>Print verbose debug information.
    Same as setting <code>NODE_DEBUG=doc</code>.</td>
  </tr>
  <tr>
   <td>--annotate</td>
   <td>-a</td>
   <td>Place resolved URLs to all documented types into the
    <code>typedefs.json</code> file and reference it in <code>package.json</code>.</td>
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

This is quite essential to understanding the status of documentation processing, and will be enabled by default in the next version.

### Hidden Files

Hidden files are ignored by default. This can be changed by setting the `DOCUMENTARY_IGNORE_HIDDEN=false` env variable.

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/7.svg?sanitize=true">
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
  <img src="/.documentary/section-breaks/8.svg?sanitize=true">
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
      <a href="https://www.artd.eco">
        <img width="100" src="https://raw.githubusercontent.com/wrote/wrote/master/images/artdeco.png"
          alt="Art Deco">
      </a>
    </th>
    <th>© <a href="https://www.artd.eco">Art Deco™</a>   2020</th>
  </tr>
</table>

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/-1.svg?sanitize=true">
</a></p>