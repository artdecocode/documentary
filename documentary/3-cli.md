## CLI

The program is used from the CLI (or `package.json` script).

```sh
doc [source] [-o output] [-trwcn] [-p "commit message"] [-h1] [-eg] [-vh]
```

The arguments it accepts are:

<argufy>types/arguments.xml</argufy>

When [`NODE_DEBUG=doc`](t) is set (or `-d` flag is passed), the program will print processing information, e.g.,

```
DOC 80734: stripping comment
DOC 80734: could not parse the table
```

This is quite essential to understanding the status of documentation processing, and will be enabled by default in the next version.

### Markdown Files

Only the following extensions are processed: `markdown`, `md`, `html`, `htm`. Anything else is ignored. This is to allow to place examples in the documentary folder. To process all files, set the `ONLY_DOC=false` variable.

### Hidden Files

Hidden files are ignored by default. This can be changed by setting the `DOCUMENTARY_IGNORE_HIDDEN=false` env variable.

%~%