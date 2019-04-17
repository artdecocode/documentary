## CLI

The program is used from the CLI (or `package.json` script).

```sh
doc source [-o output] [-trwcn] [-p "commit message"] [-h1] [-eg] [-vh]
```

The arguments it accepts are:

<argufy>types/arguments.xml</argufy>

When [`NODE_DEBUG=doc`](t) is set, the program will print processing information, e.g.,

```
DOC 80734: stripping comment
DOC 80734: could not parse the table
```

%~%