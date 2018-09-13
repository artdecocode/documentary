## CLI

The program is used from the CLI (or `package.json` script).

```sh
doc README-source.md [-o README.md] [-tgewp]
```

The arguments it accepts are:

%TABLE-MACRO flags
  `$1`, [$2](t), $3
%

```table flags
[
  ["Flag", "Meaning", "Description"],
  [
    "-o path",
    "Output Location",
    "Where to save the processed `README` file. If not specified, the output is written to the `stdout`."
  ],
  [
    "-t",
    "Only TOC",
    "Only extract and print the table of contents."
  ],
  [
    "-g [path]",
    "Generate Types",
    "Insert `@typedef` _JSDoc_ into JavaScript files. When no path is given, the files are updated in place, and when `-` is passed, the output is printed to _stdout_."
  ],
  [
    "-e [path]",
    "Extract Types",
    "Insert `@typedef` JSDoc into JavaScript files. When no path is given, the files are updated in place, and when `-` is passed, the output is printed to _stdout_."
  ],
  [
    "-w",
    "Watch Mode",
    "Watch mode: re-run the program when changes to the source file are detected."
  ],
  [
    "-p 'commit message'",
    "Automatic Push",
    "Watch + push: automatically push changes to a remote git branch by squashing them into a single commit."
  ],
  [
    "-h1",
    "h1 In Toc",
    "Include `h1` headers in the table of contents."
  ],
  [
    "-r",
    "Reverse Order",
    "Reverse the output order of files, such as that `2.md` will come before `1.md`. This could be useful when writing blogs. The `index.md` and `footer.md` files will still come first and last respectively."
  ]
]
```

When [`NODE_DEBUG=doc`](t) is set, the program will print debug information, e.g.,

```
DOC 80734: stripping comment
DOC 80734: could not parse the table
```
