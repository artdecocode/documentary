## CLI

The program is used from the CLI (or `package.json` script).

```sh
doc README-source.md [-o README.md] [-tgewp]
```

The arguments it accepts are:

```table
[
  ["Flag", "Meaning", "Description"],
  ["`-o path`", "[Output Location](t)", "Where to save the processed `README` file. If not specified, the output is written to the `stdout`."],
  ["`-t`", "[Only TOC](t)", "Only extract and print the table of contents."],
  ["`-g [path]`", "[Generate Types](t)", "Insert `@typedef` _JSDoc_ into JavaScript files. When no path is given, the files are updated in place, and when `-` is passed, the output is printed to _stdout_."],
  ["`-e [path]`", "[Extract Types](t)", "Insert `@typedef` JSDoc into JavaScript files. When no path is given, the files are updated in place, and when `-` is passed, the output is printed to _stdout_."],
  ["`-w`", "[Watch Mode](t)", "Watch mode: re-run the program when changes to the source file are detected."],
  ["`-p "commit message"`", "[Automatic Push](t)", "Watch + push: automatically push changes to a remote git branch by squashing them into a single commit."]
]
```

When [`NODE_DEBUG=doc`](t) is set, the program will print debug information, e.g.,

```
DOC 80734: stripping comment
DOC 80734: could not parse the table
```
