# documentary

%NPM: @adc/documentary%

A package to manage documentation of Node.js packages.

## Table Of Contents

%TOC%

## CLI

The `doc` client is available after installation.

### `-j`, `--jsdoc`: Add JSDoc

Update the file to include jsdoc documentation. E.g., can be used to update build files with jsdoc information from the source code. Because `_interopRequire` is a runtime call, the type is not not kept by Visual Studio Code, when a file in `build` directory exports a method from another file.

By keeping JSDoc types separate, and automatically adding them to the build files, it is easier to maintain the JSDoc documentation, as types can be put into the `types` folder.

<!-- ```sh
doc -t input-source.md [-r] [-o output.md]
``` -->

## API

To require documentary, use `import` statement:

```js
import documentary from 'documentary'
```

`documentary` has the following features:

```table
[
  ["feature", "description"],
  ["toc", "Generates a table of contents"],
  ["tables", "Display markdown tables"],
  ["comments", "Removes comments"]
]
```

```#### async runSoftware => string
[
  ["string", "path"],
  ["config", {
    "View": ["Container"],
    "actions": ["object"],
    "static?": ["boolean", true],
    "render?": ["function"]
  }, "Config"]
]
```

## Example

This section will embed an example.

%EXAMPLE: test/fixtures/example.js, ../src => documentation, javascript%

```js
## titles from code blocks with language are not included
```
```
## titles from code blocks without language are not included
```
<!--
## titles from comments are not included
```
-->

%FORK-json test/fixtures/fork.js%

## Copyright

[Art Deco](https://artdeco.bz) 2018
