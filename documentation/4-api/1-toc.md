### `Toc` Type

`Toc` is a transform stream which can generate a table of contents for incoming markdown data. For every title that the transform sees, it will push the appropriate level of the table of contents.

```### constructor => Toc
[
  ["config?", {
    "skipLevelOne?": ["boolean", "true"]
  }]
]
```

Create a new instance of a `Toc` stream.

%EXAMPLE: example/toc.js, ../src => documentary, javascript%

%FORK-fs example example/toc.js%
