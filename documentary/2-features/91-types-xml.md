
### `@typedef` Generation

For the purpose of easier maintenance of `JSDoc` `@typedef` declarations, `documentary` allows to keep them in a separate xml file, and then place the compiled versions into both source code as well as documentation. By doing this, more flexibility is achieved as types are kept in one place but can be reused for various purposes across multiple files. It is different from _TypeScript_ type declarations as `documentary` will generate a JSDoc rather than type definitions which means that the project does not have to be written in _TypeScript_.

Types are kept in an `xml` file, for example:

```xml
<types>
  <t name="ServerResponse" type="import('http').ServerResponse">
  <t name="SetHeaders"
    type="(res: ServerResponse) => any"
    desc="Function to set custom headers on response." />
  <t name="StaticConfig">
    <p string name="root">Root directory string.</p>
    <p opt number name="maxage" default="0">Browser cache max-age in milliseconds.</p>
    <p opt boolean name="hidden" default="false">Allow transfer of hidden files.</p>
    <p opt string name="index" default="index.html">Default file name.</p>
    <p opt type="SetHeaders" name="setHeaders">Function to set custom headers on response.</p>
  </t>
</types>
```

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
```

The JavaScript file is then processed with [`doc src/config-static.js -T`](t) command. After the processing is done, the `.js` file will be transformed to include the types specified in the XML file. This routine can be repeated whenever types are updated in their `xml` specifications.

```js
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
/**
 * @typedef {import('http').ServerResponse} ServerResponse
 * @typedef {(res: ServerResponse) => any} SetHeaders Function to set custom headers on response.
 * @typedef {Object} StaticConfig
 * @prop {string} root Root directory string.
 * @prop {number} [maxage="0"] Browser cache max-age in milliseconds. Default `0`.
 * @prop {boolean} [hidden="false"] Allow transfer of hidden files. Default `false`.
 * @prop {string} [index="index.html"] Default filename. Default `index.html`.
 * @prop {SetHeaders} [setHeaders] Function to set custom headers on response.
 */
```
