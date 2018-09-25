## 25 September 2018

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
