
### `@typedef` Generation

For the purpose of easier maintenance of `JSDoc` `@typedef` declarations, `documentary` allows to keep them in a separate xml file, and then place the compiled versions into both source code as well as documentation. By doing this, more flexibility is achieved as types are kept in one place but can be reused for various purposes across multiple files. It is different from _TypeScript_ type declarations as `documentary` will generate a JSDoc rather than type definitions which means that the project does not have to be written in _TypeScript_.

Types are kept in an `xml` file, for example:

%EXAMPLE: test/fixtures/types.xml, ../src => types, xml%

Here, `import('http').ServerResponse` is a feature of _TypeScript_ that allows to reference an external type in VS Code. It does not require the project to be written in _TypeScript_, but will enable correct IntelliSense completions and hits (available since VS Code at least `1.25`).

To place the compiled declaration into a source code, the following line should be placed in the `.js` file (where `types/static.xml` file existing in the project directory from which `doc` will be run):

```js
/* documentary types/static.xml */
```

```js
/* src/config-static.js */
import Static from 'koa-static'

/**
 * Configure the middleware.
 * @param {StaticConfig} config
 */
function configure(config) {
  const middleware = Static(config)
  return middleware
}

/* documentary types/static.xml */

export default configure
```

> Please note that the types marker must be placed before `export default` is done (or just `export`) as there's currently a bug in VS Code.

The JavaScript file is then processed with [`doc src/config-static.js -T`](t) command. After the processing is done, the `.js` file will be transformed to include all types specified in the XML file. On top of that, _JSDoc_ for any method that has an included type as one of its parameters will be updated to its expanded form so that a preview of options is available. This routine can be repeated whenever types are updated.

```js
/* src/config-static.js */
import Static from 'koa-static'

/**
 * Configure the middleware.
 * @param {StaticConfig} config Options to setup `koa-static`.
 * @param {string} config.root Root directory string.
 * @param {number} [config.maxage="0"] Browser cache max-age in milliseconds. Default `0`.
 * @param {boolean} [config.hidden="false"] Allow transfer of hidden files. Default `false`.
 * @param {string} [config.index="index.html"] Default file name. Default `index.html`.
 * @param {SetHeaders} [config.setHeaders] Function to set custom headers on response.
 */
function configure(config) {
  const middleware = Static(config)
  return middleware
}

/* documentary types/static.xml */
/**
 * @typedef {import('http').ServerResponse} ServerResponse
 * @typedef {(res: ServerResponse) => any} SetHeaders Function to set custom headers on response.
 * @typedef {Object} StaticConfig Options to setup `koa-static`.
 * @prop {string} root Root directory string.
 * @prop {number} [maxage="0"] Browser cache max-age in milliseconds. Default `0`.
 * @prop {boolean} [hidden="false"] Allow transfer of hidden files. Default `false`.
 * @prop {string} [index="index.html"] Default file name. Default `index.html`.
 * @prop {SetHeaders} [setHeaders] Function to set custom headers on response.
 */

export default configure
```

The `StaticConfig` type will be previewed as:

![preview of the StaticConfig](doc/types.gif)

And the `configure` function will be seen as:

![preview of the configure function](doc/configure.gif)

#### `README` placement

To place a type definition as a table into a `README` file, the `TYPEDEF` snippet can be used, where the first argument is the path to the `xml` file containing definitions, and the second one is the name of the type to embed:

```
%TYPEDEF path/definitions.xml TypeName%
```

For example, using previously defined `StaticConfig` type from `types/static.xml` file, `documentary` will process the following marker:

```
%TYPEDEF types/static.xml ServerResponse%
%TYPEDEF types/static.xml SetHeaders%
%TYPEDEF types/static.xml StaticConfig%
```

and embed it as a table:

%TYPEDEF test/fixtures/types.xml ServerResponse%
%TYPEDEF test/fixtures/types.xml SetHeaders%
%TYPEDEF test/fixtures/types.xml StaticConfig%
