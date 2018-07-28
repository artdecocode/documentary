
### `@typedef` Generation

For the purpose of easier maintenance of `JSDoc` `@typedef` declarations, `documentary` allows to keep them in a separate xml file, and then place the compiled versions into both source code as well as documentation. By doing this, more flexibility is achieved as types are kept in one place but can be reused for various purposes across multiple files. It is different from _TypeScript_ type declarations as `documentary` will generate a JSDoc rather than type definitions which means that the project does not have to be written in _TypeScript_.

Types are kept in an `xml` file, for example:

%EXAMPLE: types/static.xml%

Here, `import('http').ServerResponse` is a feature of _TypeScript_ that allows to reference an external type in VS Code. It does not require the project to be written in _TypeScript_, but will enable correct IntelliSense completions and hits (available since VS Code at least `1.25`).

To place the compiled declaration into a source code, the following line should be placed in the `.js` file (where `types/static.xml` file existing in the project directory from which `doc` will be run):

```js
/* documentary types/static.xml */
```

%EXAMPLE: example/typedef-raw.js%

<!-- /*
 * @param {StaticConfig} config Options to setup `koa-static`.
 * @param {string} config.root Root directory string.
 * @param {number} [config.maxage="0"] Browser cache max-age in milliseconds. Default `0`.
 * @param {boolean} [config.hidden="false"] Allow transfer of hidden files. Default `false`.
 * @param {string} [config.index="index.html"] Default file name. Default `index.html`.
 * @param {SetHeaders} [config.setHeaders] Function to set custom headers on response.
 */ -->

> Please note that the types marker must be placed before `export default` is done (or just `export`) as there's currently a bug in VS Code.

The JavaScript file is then processed with [`doc src/config-static.js -T`](t) command. After the processing is done, the `.js` file will be transformed to include all types specified in the XML file. On top of that, _JSDoc_ for any method that has an included type as one of its parameters will be updated to its expanded form so that a preview of options is available. This routine can be repeated whenever types are updated.

%EXAMPLE: example/typedef.js%

<!--
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
``` -->

The `StaticConfig` type will be previewed as:

![preview of the StaticConfig](doc/typedef-Type.gif)

And the `configure` function will be seen as:

![preview of the configure function](doc/typedef-config.gif)

#### `README` placement

To place a type definition as a table into a `README` file, the `TYPEDEF` snippet can be used, where the first argument is the path to the `xml` file containing definitions, and the second one is the name of the type to embed. Moreover, links to the type descriptions will be created in the table of contents using the [__TOC Titles__](#toc-titles), but to prevent this, the `noToc` attribute should be set for a type.

```
%TYPEDEF path/definitions.xml TypeName%
```

For example, using previously defined `StaticConfig` type from `types/static.xml` file, `documentary` will process the following markers:

```
%TYPEDEF types/static.xml ServerResponse%
%TYPEDEF types/static.xml SetHeaders%
%TYPEDEF types/static.xml StaticConfig%
```

or a single marker to include all types in order in which they appear in the `xml` file (doing this also allows to reference other types from properties):

```
%TYPEDEF types/static.xml%
```

and embed resulting type definitions:

%TYPEDEF test/fixtures/types.xml%

#### `<i name="Type" from="package" />`

A special `i` (for `import`) element can be used to import a Type using Visual Code's TypeScript engine. An import looks like `/** @typedef {import('package').Type} Type */`, so that `name` attribute is the name of the type in the referenced package, and `from` attribute is the name of the module from which to import the type. This makes it easier to reference the external type later in the file. However, it is not supported in older versions of _VS Code_.

<table>
<thead>
<tr>
<th>Original Source</th>
<th>Types Definition</th>
</tr>
</thead>
<tbody>
<tr/>
<tr><td>

%EXAMPLE: example/generate-imports.js, ../src => src, js%
</td>
<td>

%EXAMPLE: types/import.xml%
</td>
</tr>
<tr>
<td colspan="2" align="center">
<strong>Output</strong>
</td></tr>
<tr>
<td colspan="2">

%FORK-js src/bin/register example/generate-imports.js -g -%
</td>
</tr>
</tbody>
</table>

