## 5 August 2018

### 1.11.0

- [feature] `@typedef` organisation, required props in `type` to have `*`.
- [feature] Partial example with `/* start/end example */`, always debuglog `example`.
- [deps] Move markers to `restream`.
- [fix] Non-greedy example regexp.

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
