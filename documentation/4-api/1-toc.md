### `Toc` Type

`Toc` is a transform stream which can generate a table of contents for incoming markdown data. For every title that the transform sees, it will push the appropriate level of the table of contents.

```### constructor => Toc
[
  ["config?", {
    "skipLevelOne?": ["boolean", "false"]
  }]
]
```

Create a new instance of a `Toc` stream.

%EXAMPLE: example/toc.js, ../src => documentary, javascript%

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
