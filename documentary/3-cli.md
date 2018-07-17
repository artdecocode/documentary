## CLI

The program is used from the CLI (or `package.json` script).

```sh
doc README-source.md [-o README.md] [-t] [-w]
```

The arguments it accepts are:

```table
[
  ["argument", "Description"],
  ["`-o`", "Where to save the processed `README` file. If not specified, the output is written to the `stdout`."],
  ["`-t`", "Only extract and print the table of contents."],
  ["`-w`", "Watch mode: re-run the program when changes to the source file are detected."],
  ["`-p`", "Watch + push: automatically push changes to a remote git branch by squashing them into a single commit."]
]
```

When `NODE_DEBUG=doc` is set, the program will print debug information, e.g.,

```
DOC 80734: stripping comment
DOC 80734: could not parse the table
```
