## 19 December 2019

### [1.34.10](https://github.com/artdecocode/documentary/compare/v1.34.9...v1.34.10)

- [feature] Place methods inside the documentation with `<method>` component.

## 18 December 2019

### [1.34.9](https://github.com/artdecocode/documentary/compare/v1.34.8...v1.34.9)

- [fix] Fix links with `[]` in types' markdown tables.

### [1.34.8](https://github.com/artdecocode/documentary/compare/v1.34.7...v1.34.8)

- [feature] Read relative examples paths via _Typal_ update.

### [1.34.7](https://github.com/artdecocode/documentary/compare/v1.34.6...v1.34.7)

- [fix] Fix examples for properties.

## 17 December 2019

### [1.34.6](https://github.com/artdecocode/documentary/compare/v1.34.5...v1.34.6)

- [fix] Fix levels for types via `<typedef>` element.

### [1.34.5](https://github.com/artdecocode/documentary/compare/v1.34.4...v1.34.5)

- [fix] Remove debuglog for standard `console.error`.

## 16 December 2019

### [1.34.4](https://github.com/artdecocode/documentary/compare/v1.34.3...v1.34.4)

- [deps] Update `typal` to fix examples.
- [feature] Pass `-d` flag for debug.

### [1.34.3](https://github.com/artdecocode/documentary/compare/v1.34.2...v1.34.3)

- [fix] Fix `indicatrix` for _Wiki_.
- [feature] Embed examples for **Typal**'s slim functions.

## 9 December 2019

### [1.34.2](https://github.com/artdecocode/documentary/compare/v1.34.1...v1.34.2)

- [fix] Fix `<typedef>` when printing function descriptions with pre blocks.

## 22 October 2019

### [1.34.1](https://github.com/artdecocode/documentary/compare/v1.34.0...v1.34.1)

- [comps] Wrap Java args in console with `DOCUMENTARY_MAX_COLUMNS`, document all java args in Wiki.

## 14 October 2019

### [1.34.0](https://github.com/artdecocode/documentary/compare/v1.33.3...v1.34.0)

- [repo] Add wiki as submodule.
- [comps] Shell component without console, correct console notation.
- [comps] Implement `java` component.

## 18 September 2019

### [1.33.3](https://github.com/artdecocode/documentary/compare/v1.33.2...v1.33.3)

- [fix] Place more than one link with _Html_ component.

## 15 September 2019

### [1.33.2](https://github.com/artdecocode/documentary/compare/v1.33.1...v1.33.2)

- [fix] Fix missing `stdlib` dir in published package.

### [1.33.1](https://github.com/artdecocode/documentary/compare/v1.33.0...v1.33.1)

- [fix] Correct `npm-badge` for packages with a `.`.

## 12 September 2019

### [1.33.0](https://github.com/artdecocode/documentary/compare/v1.32.2...v1.33.0)

- [feature] Add _indicatrix_ GIF placeholder support for bash scripts.

## 2 September 2019

### [1.32.2](https://github.com/artdecocode/documentary/compare/v1.32.1...v1.32.2)

- [fix] Fix escaping in **md2html**.
- [deps] Upgrade deps (_ÀLaMode_ 3).

## 17 August 2019

### [1.32.1](https://github.com/artdecocode/documentary/compare/v1.32.0...v1.32.1)

- [fix] Fix argufy component by calling `setPretty` before async kicks in.
- [deps] Upd competent and render.

## 11 August 2019

### [1.32.0](https://github.com/artdecocode/documentary/compare/v1.31.1...v1.32.0)

- [feature] Implement and document custom method titles.
- [feature] Push wiki changes with `-p` option.
- [fix] Use regex for wiki focus feature.
- [fix] Cache forks with different env variables separately.
- [fix] Clear fork queue in watch mode.
- [api] Ignore hidden files.

## 8 August 2019

### [1.31.1](https://github.com/artdecocode/documentary/compare/v1.31.0...v1.31.1)

- [fix] Allow to escape `_*` in _md2html_ component, cut out all `<tags att="...">` before processing, and accept zero-char codes, e.g., ``.
- [fix] Display wide methods (2 cols) and their descriptions in the table, underline properties of constructors/interfaces.
- [deps] Upgrade _Typal_ to the lib-compiled one, with typedefs.
- [feature] Skip some file extensions from being processed, so that assets can be placed in documentary/wiki folder.
- [fix] Allow for indented typedefs (e.g., in `li` blocks).

## 7 August 2019

### [1.31.0](https://github.com/artdecocode/documentary/compare/v1.30.3...v1.31.0)

- [feature] New design of method titles.
- [package] Add _Competent_ to stdlib and reduce dependencies to 3.

### [1.30.3](https://github.com/artdecocode/documentary/compare/v1.30.2...v1.30.3)

- [feature] Print `static` tag in typedef tables.

## 3 August 2019

### [1.30.2](https://github.com/artdecocode/documentary/compare/v1.30.1...v1.30.2)

- [deps] Update _Typal_ to include missing `@wrote/read` dependency.

### [1.30.1](https://github.com/artdecocode/documentary/compare/v1.30.0...v1.30.1)

- [deps] Add `@wrote/read-dir-structure` to _stdlib_.

### [1.30.0](https://github.com/artdecocode/documentary/compare/v1.29.0...v1.30.0)

- [package] Move most of dependencies to the standard lib.
- [feature] `<fork>` component with answers and env variables.

## 31 July 2019

### [1.29.0](https://github.com/artdecocode/documentary/compare/v1.28.2...v1.29.0)

- [fix] Convert `[link](#link)` into HTML in `md2html`, while preserving toc-links.
- [fix] Correct wiki-linking of types across pages behaviour.
- [fix] Don't add `<a name="table-of-contents"></a>` in _justToc_ mode.
- [doc] Move documentation to _Wiki_.

## 30 July 2019

### [1.28.2](https://github.com/artdecocode/documentary/compare/v1.28.1...v1.28.2)

- [fix] Escape _innerHtml_ of `a` elements in `md2html`.

## 29 July 2019

### [1.28.1](https://github.com/artdecocode/documentary/compare/v1.28.0...v1.28.1)

- [fix] Correctly parse multiple arguments in section breaks.
- [fix] Section breaks in Wikis.
- [feature] Focus on wiki pages.
- [feature] Add `#table-of-contents` anchor for Toc, if no title present.

## 26 July 2019

### [1.28.0](https://github.com/artdecocode/documentary/compare/v1.27.7...v1.28.0)

- [feature] Process wikis.

## 21 July 2019

### [1.27.7](https://github.com/artdecocode/documentary/compare/v1.27.6...v1.27.7)

- [fix] Remove `[link](#link)` anchor tag from underlined titles in table of contents.

## 20 July 2019

### [1.27.6](https://github.com/artdecocode/documentary/compare/v1.27.5...v1.27.6)

- [feature] Align TREE with the indentation it receives.
- [fix] Place Example And Tree rules after the components so that components ran render TREE and EXAMPLE.

## 17 July 2019

### [1.27.5](https://github.com/artdecocode/documentary/compare/v1.27.4...v1.27.5)

- [feature] Fold absolute paths using `/` in FORK.
- [fix] Don't cut `table` blocks out to be able to process tables created with a fork process.

## 29 June 2019

### [1.27.4](https://github.com/artdecocode/documentary/compare/v1.27.3...v1.27.4)

- [deps] Upgrade dependencies.
- [docs] Fix extra section break.

## 15 May 2019

### [1.27.3](https://github.com/artdecocode/documentary/compare/v1.27.2...v1.27.3)

- [fix] Absolute path to section breaks.

## 7 May 2019

### [1.27.2](https://github.com/artdecocode/documentary/compare/v1.27.1...v1.27.2)

- [feature] Allow to write `-` as `<li>` tags into typedef tables.

## 4 May 2019

### [1.27.1](https://github.com/artdecocode/documentary/compare/v1.27.0...v1.27.1)

- [fix+feature] New lines and `li` mappings in the table rule.

### [1.27.0](https://github.com/artdecocode/documentary/compare/v1.26.5...v1.27.0)

- [feature] Watch assets for update, try to git push straight after running the command.

## 1 May 2019

### [1.26.5](https://github.com/artdecocode/documentary/compare/v1.26.4...v1.26.5)

- [typal] Update typal to fix extra escapes and allow to give description of a linked type in a `title` attribute of an `a` element.

## 30 April 2019

### [1.26.4](https://github.com/artdecocode/documentary/compare/v1.26.3...v1.26.4)

- [build] Build the update.

### [1.26.3](https://github.com/artdecocode/documentary/compare/v1.26.2...v1.26.3)

- [deps] Upgrade `typal`.

## 29 April 2019

### [1.26.1](https://github.com/artdecocode/documentary/compare/v1.26.1...v1.26.2)

- [fix] Change namespace argument to be a string.
- [deps] Update [_Typal_](https://artdecocode.com/typal) to use typedefs parser, and give link to supported types for linking.

## 25 April 2019

### [1.26.1](https://github.com/artdecocode/documentary/compare/v1.26.0...v1.26.1)

- [feature] Await for the same fork on a different stream (stderr/stdout).

## 24 April 2019

### [1.26.0](https://github.com/artdecocode/documentary/compare/v1.25.0...v1.26.0)

- [deps] Upgrade to _ÀLaMode@v2_.

## 23 April 2019

### [1.25.0](https://github.com/artdecocode/documentary/compare/v1.24.1...v1.25.0)

- [feature] Indent the `EXAMPLE` output if there was padding.
- [deps] Use `competent` for components rendering.

## 19 April 2019

### [1.24.1](https://github.com/artdecocode/documentary/compare/v1.24.0...v1.24.1)

- [package] Export _Typal_ in the `bin` field of _package.json_.

### [1.24.0](https://github.com/artdecocode/documentary/compare/v1.23.4...v1.24.0)

- [fix] Save cache after running without cache; filter markdown in ToC headings' links.
- [feature] Indent fork output, pass env variables; set the default source location to `documentary`.
- [components] `md2html`, `argufy` components.
- [deps] Use [_Argufy_](https://artdecocode.com/argufy/) for CLI arguments and _Typal_(https://artdecocode.com/typal/) for typedefs.
- [doc] Move advanced _Typal_ usage to a separate readme page.

## 4 April 2019

### [1.23.4](https://github.com/artdecocode/documentary/compare/v1.23.3...v1.23.4)

- [deps] Update `typal`.

### [1.23.3](https://github.com/artdecocode/documentary/compare/v1.23.2...v1.23.3)

- [deps] Unfix some dependencies.
- [deps] Move functionality into `clearr` and `@depack/cache`.

## 30 March 2019

### [1.23.2](https://github.com/artdecocode/documentary/compare/v1.23.1...v1.23.2)

- [fix] Fix special characters in TOC hrefs.

## 28 March 2019

### [1.23.1](https://github.com/artdecocode/documentary/compare/v1.23.0...v1.23.1)

- [feature] Display filenames by switching _Pedantry_ to the object mode.
- [fix] Upgrade static-analysis to fix the recursion bug.

### [1.23.0](https://github.com/artdecocode/documentary/compare/v1.22.0...v1.23.0)

- [feature] Fork output caching; native ÀLaMode for forked modules; handle `\r` in forks.
- [refactor] Update the TOC logic to get results from _Documentary_ stream, rather than a parallel stream.
- [fix] Correct typedef indentation for classes.

## 11 March 2019

### 1.22.0

- [feature] Add **<shell>** component, handle string return by components and errors in them, commit `web-components.json` file.
- [deps] Replace `preact-render-to-string` with `@depack/render`.

## 7 March 2019

### 1.21.5

- [fix] Enable install on NPM.

## 2 March 2019

### 1.21.4

- [feature] Add async components support.
- [fix] Correctly replace import statements with new lines in examples.

## 26 February 2019

### 1.21.3

- [fix] Strip ANSI from fork output.

## 11 February 2019

### 1.21.2

- [fix] Fix the bug in `typedef` caching when the type name is specified.

## 26 January 2019

### 1.21.1

- [fix] Detect components with multiline arguments.
- [refactor] Rename `index.js` to `doc.js` and make `alamode.js` as an executable `bin/index.js`.

## 25 January 2018

### 1.21.0

- [feature] Reusable JSX components.

## 25 September 2018

### 1.20.1

- [fix] Skip the `Default` column in Markdown types when no properties have a default.

### 1.20.0

- [feature] Parse `Object.<string, Type>` for types linking.
- [dep] Move Type and Property classes to the `typal` package.
- [fix] Prefix links to types with `type`, so that there is no interference with heading titles.

## 24 September 2018

### 1.19.0

- [feature] Implement macros to substitute data into placeholders.
- [desc] Decrease the description size.

## 20 September 2018

### 1.18.2

- [fix] Fix a bug when a table in comments were not being cut out properly; fix parsing table with `null` values.

### 1.18.1

- [fix] Cut method titles in _Typedefs_ stream to prevents errors when a method title is followed by a code block.

### 1.18.0

- [feature] Link to generic types, such as `Promise.<Type>`.
- [feature] Add external linking of `import` types.

## 17 September 2018

### 1.17.0

- [feature] Link `typedef` definitions across the whole README document by scanning the whole of the source documentation first; links for piped types.
- [test] Organise mask tests by `mask` and `result`, use `zoroaster@3.4` to pass `getTransform`, `getReadable` and `fork` properties to the mask factory; fix some erronous tests (no `expected` for one table, reading .js supporting files for .md masks).
- [doc] Place `@typedefs > README` above advanced spread, improve English.

## 15 September 2018

### 1.16.1

- [fix] Append `?sanitize=true` to be able to load SVGs from GitHub on NPM.

### 1.16.0

- [feature] Section breaks to visually split content and jump back to the top.
- [feature] Compile read files in reverse order (e.g., for blogs).
- [feature] Display the position of error when trying to parse a table.
- [fix] Make sure pointers such as `$1` in inner code in table macros also participate in replacements there.
- [test] Add a separate folder for masts.
- [docs] Move features 1 level up, separate sections for fork and examples, add key features summary at the top; add section breaks; insert logo.
- [deps] Update _Pedantry_ to automatically insert blank lines between files.
- [refactor] Create `ChunkReplaceable` in the _Toc_ stream for easier processing of incoming files; change `run` method to not buffer the input stream which Toc is generated, but read files again.

## 13 September 2018

### 1.15.2

- [fix] Add a toc line for a method title without args or return, e.g.,
    ````
    ```### destroy
    ```
    ````
- [deps] Update dependencies to not have `clean-stack` installed from GitHub commit.

### 1.15.1

- [fix] Allow to use toc-titles in the macros.
- [fix] Fix putting `---` with empty line above in the table of contents.

### 1.15.0

- [feature] Implement table macros for templating in tables.
- [fix] Make sure toc-titles work with partial inner code in them, e.g.,
    ```
    [hello `world`](t)
    ```
- [feature] Make example escape content with 4 backticks, and make sure code from the example does not get replaced further down (e.g., if example inserts a table).
- [feature] Align content inside tables (does not work properly with a toc title.)
- [deps] Update `zoroaster@3.0.4`.
- [refactor] Create separate `Documentary` file to eventually only use it as a stream instead of `createReplaceStream`.
- [tests] Rewrite some tests as masks; remove unhandled rejection.


## 5 September 2018

### 1.14.0

- [feature] Pass `h1` to CLI to include top-level headings in the table of contents.
- [feature] Parse underlined titles.
- [refactor] Change `Toc` to not use super-regex, but remember positions and reorder before push.
- [fix] Easier title regex, and only allow titles with a space between `#` and text.

### 1.13.0

- [feature] Add `FORKERR` marker to print output of the `stderr` in fork.

### 1.12.0

- [feature] Replace `require` source in examples.

## 1 September 2018

### 1.11.0

- [feature] `@typedef` organisation, required props in `type` to have `*`.
- [feature] Partial example with `/* start/end example */`, always debuglog `example`.
- [package] Add keywords.
- [deps] Move markers to `restream`.
- [deps] Create and use a separate `which-stream` package.
- [deps] Update to `zoroaster@3`.
- [build] Build w/ [`alamode`](https://alamode.cc).
- [fix] Non-greedy example regexp.
- [fix] Surround with ```` when forked output contains backticks.

## 18 July 2018

### 1.10.0

- [feature] Dedicated example row in `Type` definition, skip `Examples` header when no non-row examples are given, non-greedy type regex.

## 17 July 2018

### 1.9.0

- [feature] Automatic `git` push during watch with `-p` argument.

## 3 July 2018

### 1.8.2

- [fix] Enable `npm` badge for the scoped packages.
- [tests] Assertions in context for regular expression matching.

## 30 June 2018

### 1.8.1

- [fix] tidy up table markup spacing
- [doc] xml type to `Type` examples
- [package] easy commit `doc` commands

## 26 June 2018

### 1.8.0

- [feat] Document types with `%TYPE%` marker.
- [feat] Use short argument type for TOC from method titles.
- [doc] document `skipLevelOne` better, remove VS Code ignoring README note.

## 24 June 2018

### 1.7.0

- [feat] Gif detail replacements.

## 22 June 2018

### 1.6.1

- [dep] Remove `wrote`, implement simple file read.
- [fix] `skipLevelOne=true` in documentation.

### 1.6.0

- [feature] Embed the output of a Node.js module with `FORK`.
- [feature] Link titles - add a link and reference it in the table of contents.
- [fix] Don't process text in inner code (`inner`), testing, finer replacements order.

## 21 June 2018

### 1.5.0

- [feature] `tree` rule to embed directories structures representation
- [doc] embed examples, generate trees

### 1.4.2

- [fix] don't process code blocks for titles and other transforms.
- [doc] build with properly escaped examples of `md` source code for method-title generation.

### 1.4.1

- [fix] skip titles from code blocks and comments for Table Of Contents generation.
- [dep] switch from `dir-stream` to `Pedantry`.

## 20 June 2018

### 1.4.0

- [feature] examples placement
- [fix] re-enable watch mode

## 18 June 2018

### 1.3.1

- [doc] specify install snippet as `-DE`
- [package] rename `README` to `documentation`

### 1.3.0

- [feature] splitting topics into folders, npm badge replace rule
- [doc] split into files in the `README` directory

## 15 June 2018

### 1.2.0

- [feature] method titles generation with shorthand TOC for them.

### 1.1.0

- [feature] parsing tables, `watch` mode,

## 12 June 2018

### 1.0.1

- [test] add tests
- [dep] skip currently unused dependencies

### 1.0.0

- Create `documentary` with [`mnp`][https://mnpjs.org]
- [repository]: `src`, `test`
