### Built-In Components

There are a number of built-in components at the moment.

#### `<`shell command?=""`>`

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
```sh
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
<tr></tr>
<tr><td>
<shell>
  (echo abc; sleep 1; echo def; sleep 1; echo ghi) | node test/fixture/node
</shell>
</td><tr>
</table>