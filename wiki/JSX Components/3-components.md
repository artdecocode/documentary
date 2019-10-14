## Built-In Components

There are a number of built-in components at the moment.

### `<`shell command?=""`>`

Either uses `spawn` to spawn a command and pass arguments to it, or `exec` to get the result of a more complex operations such as piping to other commands reachable from shell.

Usage:

```jsx
<shell command="echo"/>
<shell command="echo">ABC</shell>
<shell command="echo">
  Hello World
  example123
</shell>

<shell>
  (echo abc; sleep 1; echo def; sleep 1; echo ghi) | node consume2.js
</shell>
<shell noTrim>
  (echo abc;) | node consume2.js
</shell>
```

Executes a command as if by the user from the terminal, i.e., `$ echo example` and shows its output after printing the command like

````sh
```{language}
$ {command}
```
```{language = sh}
{output}
```
````

%TYPEDEF types/components/shell.xml%

If the command is not passed, the children will be read and executed by the `child_process`._exec_ method. For example, with the following simple receiver:

%EXAMPLE: test/fixture/node.js%

The _shell_ component can be used to print output of a complex unix expression. The output will be trimmed before inserting in the documentation. This can be disabled with the `noTrim` option.

```html
<shell>
  (echo abc; sleep 1; echo def; sleep 1; echo ghi) | node test/fixture/node
</shell>
```

<table>
<tr><th>Result Embedded Into README</th></tr>
<tr/>
<tr><td>

<shell>
  (echo abc; sleep 1; echo def; sleep 1; echo ghi) | node test/fixture/node
</shell>
</th></td>
</table>

%~ width="20"%

### `<`argufy`>`

This component is used together with _Argufy_ package which keeps arguments to command-line programs in an XML file, and allows to generate JS to extract them from `process.argv` easily and in _Google Closure Compiler_-compatible way. _Documentary_ allows to place the table with all arguments defined in the `arguments.xml` file by using `<argufy>types/arguments.xml</argufy>` marker. It's child is the location of the arguments file, and if not given, it will default to `types/arguments.xml`. If an `arg` element had `toc` property, it will also be liked to the ToC using a toc-title. [See the table](#cli) generated for _Documentary_ for an example of how the documentation of CLI arguments will look like.

%~ width="20"%

### `<`md2html`>`

Converts the markdown with `_`/`__`/`*`/`**`/<code>`</code>/
`[link](#link)` into HTML. The main use of this widget is to be able to write tables with markdown and avoid having a whitespace at the bottom of the table row:

```html
<table>
<tr><td>

  `Hello World`: _notice_ the padding at the **bottom** of this row.
</td></tr>
<tr><td>
<md2html>

  `Markdown 2 HTML`: _the text_ has been updated with the **md2html** component.
</md2html>
</td></tr>
</table>
```

<table>
<tr><td>

  `Hello World`: _notice_ the padding at the **bottom** of this row.
</td></tr>
<tr><td>
<md2html>

  `Markdown 2 HTML`: _the text_ has been updated with the **md2html** component.
</md2html>
</td></tr>
</table>

%~ width="20"%

### `<`java`>`

The _Java_ component allow to execute a Java process. The `jar` argument will set the `-jar` option, and all found arguments in the inner code block will be split by whitespace and passed to the process. The cache will be formed based on all arguments that can be resolved to paths on the filesystem, so that the program won't have to be rerun when nothing had changed.

```html
<java jar="path-to-jar.jar" console="doc-wiki" lang="css">
  --argument optionsA --pretty-print
</java>
```

<table>
<tr><th>Java Result</th></tr>
<tr/>
<tr><td>

<java jar="closure-stylesheets.jar" console="doc-wiki" lang="css">
  --pretty-print example/example.css
</java>
</th></td>
</table>

<!-- MacBook:documentary zavr$ ln -s  /Users/zavr/node_modules/closure-stylesheets-java/target/closure-stylesheets-1.8.0-SNAPSHOT-jar-with-dependencies.jar closure-stylesheets.jar -->