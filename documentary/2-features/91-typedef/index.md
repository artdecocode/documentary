
### `@typedef` Organisation

For the purpose of easier maintenance of _JSDoc_ `@typedef` declarations, `documentary` allows to keep them in a separate XML file, and then place compiled versions into both source code as well as documentation. By doing this, more flexibility is achieved as types are kept in one place but can be reused for various purposes across multiple files. It is different from _TypeScript_ type declarations as `documentary` will generate _JSDoc_ comments rather than type definitions which means that a project does not have to be written in _TypeScript_.

Types are kept in an `xml` file, for example:

%EXAMPLE: types/static.xml%

<!--

Here, `import('http').ServerResponse` is a feature of _TypeScript_ that allows to reference an external type in VS Code. It does not require the project to be written in _TypeScript_, but will enable correct IntelliSense completions and hits (available since VS Code at least `1.25`). -->

To include a compiled declaration into a source code, the following line should be placed in the `.js` file (where the `types/static.xml` file exists in the project directory from which the `doc` command will be run):

```js
/* documentary types/static.xml */
```

For example, an unprocessed _JavaScript_ file can look like this:

%EXAMPLE: example/typedef-raw.js%

> Please note that the types marker must be placed before `export default` is done (or just `export`) as there's currently a bug in VS Code.

The file is then processed with [`doc src/config-static.js -g`](#insert-types) command and updated in place, unless `-` is given as an argument, which will print the output to _stdout_.

After the processing is done, the source code will be transformed to include all types specified in the XML file. On top of that, _JSDoc_ for any method that has an included type as one of its parameters will be updated to its expanded form so that a preview of options is available. This routine can be repeated whenever types are updated.

%FORK-js src/bin/register example/typedef-raw.js -g -%

<!-- The `StaticConfig` type will be previewed as:

![preview of the StaticConfig](doc/typedef-Type.gif) -->

Because the `@param` _JSDoc_ has been expanded, the properties of the argument to the `configure` function will be seen fully:

![preview of the configure function](doc/typedef-config.gif)

This is in contrast to the preview without _JSDoc_ expansion:

![preview of the configure function without expanded params](doc/no-expansion.gif)
