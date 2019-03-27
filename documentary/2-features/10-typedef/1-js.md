### JS Placement

To include a compiled declaration into the source code, the following line should be placed in the `.js` file (where the `types/static.xml` file exists in the project directory from which the `doc` command will be run):

```js
/* documentary types/static.xml */
```

For example, an unprocessed _JavaScript_ file can look like this:

%EXAMPLE: example/typedef-raw.js%

> Please note that the types marker must be placed before `export default` is done (or just `export`) as there's currently a bug in VS Code.

The file is then processed with [`doc src/config-static.js -g`](#generate-types) command and updated in place, unless `-` is given as an argument, which will print the output to _stdout_, or the path to the output file is specified. After the processing is done, the source code will be transformed to include all types specified in the XML file. This routine can be repeated whenever types are updated.

%FORK-js src/bin/doc example/typedef-raw.js -g -%

#### Expanded `@param`

In addition, _JSDoc_ for any method that has got an included type as one of its parameters will be updated to its expanded form so that a preview of options is available.

Therefore, a raw function _JSDoc_ of a function written as

```js
/**
 * Configure the middleware.
 * @param {StaticConfig} config Options to setup `koa-static`.
 */
function configure(config) {
  const middleware = Static(config)
  return middleware
}
```

will be expanded to include the properties of the type:

```js
/**
 * Configure the middleware.
 * @param {StaticConfig} config Options to setup `koa-static`.
 * @param {string} config.root Root directory string.
 * @param {number} [config.maxage=0] Browser cache max-age in milliseconds. Default `0`.
 * @param {boolean} [config.hidden=false] Allow transfer of hidden files. Default `false`.
 * @param {string} [config.index="index.html"] Default file name. Default `index.html`.
 * @param {SetHeaders} [config.setHeaders] Function to set custom headers on response.
 */
function configure(config) {
  const middleware = Static(config)
  return middleware
}
```

This makes it possible to see the properties of the argument to the `configure` function fully:

![preview of the configure function](doc/typedef-config.gif)

And the description of each property will be available when passing an argument to the function:

![preview of a property description](doc/desc.gif)

Compare that to the preview without _JSDoc_ expansion:

![preview of the configure function without expanded params](doc/no-expansion.gif)

To prevent the expansion, the `noExpand` attribute should be added to the type.