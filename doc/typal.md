## **`@typedef` Organisation**

For the purpose of easier maintenance of _JSDoc_ `@typedef` declarations, _Documentary_ allows to keep them in a separate XML file, and then place compiled versions into both source code as well as documentation. By doing this, more flexibility is achieved as types are kept in one place but can be reused for various purposes across multiple files. It is different from _TypeScript_ type declarations as _Documentary_ will generate _JSDoc_ comments rather than type definitions which means that a project does not have to be written in _TypeScript_.

Types are kept in a separate `xml` file, for example:

```xml
<types>
  <import name="ServerResponse" from="http"
    link="https://nodejs.org/api/http.html#http_class_http_serverresponse"
  />
  <type name="SetHeaders"
    type="(res: ServerResponse) => any"
    desc="Function to set custom headers on response." />
  <type name="RightsConfig"
    type="{ location: string, rights: number }[]"
    desc="Configuration of read and write access rights." />
  <type name="StaticConfig" desc="Options to setup `koa-static`.">
    <prop string name="root">
      Root directory string.
    </prop>
    <prop number name="maxage" default="0">
      Browser cache max-age in milliseconds.
    </prop>
    <prop boolean name="hidden" default="false">
      Allow transfer of hidden files.
    </prop>
    <prop string name="index" default="index.html">
      Default file name.
    </prop>
    <prop opt type="SetHeaders" name="setHeaders">
      Function to set custom headers on response.
    </prop>
    <prop opt type="Promise.<RightsConfig>" name="rightsPromise">
      The promise which will be resolved with access rights to files.
    </prop>
  </type>
</types>
```

They are then included in both JavaScript source code and markdown documentation.

### JS Placement

To include a compiled declaration into the source code, the following line should be placed in the `.js` file (where the `types/static.xml` file exists in the project directory from which the `doc` command will be run):

```js
/* documentary types/static.xml */
```

For example, an unprocessed _JavaScript_ file can look like this:

```js
/* src/config-static.js */
import Static from 'koa-static'

/**
 * Configure the middleware.
 */
function configure(config) {
  const middleware = Static(config)
  return middleware
}

/* documentary types/static.xml */

export default configure
```

> Please note that the types marker must be placed before `export default` is done (or just `export`) as there's currently a bug in VS Code.

The file is then processed with [`doc src/config-static.js -g`](#generate-types) command and updated in place, unless `-` is given as an argument, which will print the output to _stdout_, or the path to the output file is specified. After the processing is done, the source code will be transformed to include all types specified in the XML file. This routine can be repeated whenever types are updated.

```js
Typal: smart typedefs https://artdecocode.com/typal/
Please use typal (included w/ Documentary):

typal example/typedef-raw.js [--closure]
```

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

![preview of the configure function](./typedef-config.gif)

And the description of each property will be available when passing an argument to the function:

![preview of a property description](./desc.gif)

Compare that to the preview without _JSDoc_ expansion:

![preview of the configure function without expanded params](./no-expansion.gif)

To prevent the expansion, the `noExpand` attribute should be added to the type.

### README placement

To place a type definition as a table into a `README` file, the `TYPEDEF` marker can be used, where the first argument is the path to the `xml` file containing definitions, and the second one is the name of the type to embed. Moreover, links to the type descriptions will be created in the table of contents using the [__TOC Titles__](#toc-titles), but to prevent this, the `noToc` attribute should be set for a type.

```
%TYPEDEF path/definitions.xml [TypeName]%
```

For example, using the previously defined `StaticConfig` type from `types/static.xml` file, _Documentary_ will process the following markers:

```
%TYPEDEF types/static.xml ServerResponse%
%TYPEDEF types/static.xml SetHeaders%
%TYPEDEF types/static.xml StaticConfig%
```

or a single marker to include all types in order in which they appear in the `xml` file:

```
%TYPEDEF types/static.xml%
```

and embed resulting type definitions (with the imported type linked to the Node.js documentation due to its `link` attribute):



_Documentary_ wil scan each source file of the documentation first to build a map of all types. Whenever a property appears to be of a known type, it will be automatically linked to the location where it was defined. It is also true for properties described as generic types, such as `Promise.<Type>`. This makes it possible to define all types in one place, and then reference them in the API documentation.

### Advanced Usage

The basic functionality of maintaining types in the source `JavaScript` and `MarkDown` files is mostly enough. In addition, there are some advanced patterns which can be used in JavaScript.

#### Spread `@param`

When a type is just an object, it can be spread into a notation which contains its properties for even better visibility. To do that, the `spread` attribute must be added to the type definition in the `xml` file.

Again, a raw function with JSDoc:

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

Can be re-written as spread notation of a type.

```js
/**
 * Configure the middleware.
 * @param {{ root: string, maxage?: number, hidden?: boolean, index?: string, setHeaders?: SetHeaders }} config Options to setup `koa-static`.
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

The properties will be visible in the preview:

![preview of the configure function with stread params](./spread.gif)

However, this method has one disadvantage as there will be no descriptions of the properties when trying to use them in a call to function:

![spread will not have a description](./no-desc.gif)

Therefore, it must be considered what is the best for developers -- to see descriptions of properties when passing a configuration object to a function, but not see all possible properties, or to see the full list of properties, but have no visibility of what they mean.

It is also not possible to automatically update the spread type in place, because the information about the original type is lost after its converted into the object notation.

Generally, this feature should not be used, because the autocompletion list can be summoned by hitting <kbd>ctrl</kbd><kbd>     </kbd>.

### Importing Types

A special `import` element can be used to import a type using _VS Code_'s _TypeScript_ engine. An import is just a typedef which looks like `/** @typedef {import('package').Type} Type */`. This makes it easier to reference an external type later in the file. However, it is not supported in older versions of _VS Code_.

The import will never display in the Table of Contents as its an external type and should be used to document internal API. There are three attributes supported by the `import` element:

| Attribute |                  Meaning                   |
| --------- | ------------------------------------------ |
| from      | The package from which to import the type. |
| name      | The name of the type.                      |
| link      | The link to display in the documentation.  |

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

```js
async function example() {
  process.stdout.write('example\n')
}

/* documentary types/import.xml */

export default example
```
</td>
<td>

```xml
<types>
  <import name="IncomingMessage" from="http" />
  <import name="ServerResponse" from="http" />
  <import name="StorageEngine" from="koa-multer" />
  <import name="File" from="koa-multer" />
  <type type="(f: File) => void" name="Function"
    desc="A function to save a file." />
</types>
```
</td>
</tr>
<tr>
<td colspan="2" align="center">
<strong>Output</strong>
</td></tr>
<tr>
<td colspan="2">

```js
Typal: smart typedefs https://artdecocode.com/typal/
Please use typal (included w/ Documentary):

typal example/generate-imports.js [--closure]
```
</td>
</tr>
</tbody>
</table>

### XML Schema

The XML file should have the following nodes and attributes:

<table>
<thead>
 <tr>
  <th>Node</th>
  <th>Description</th>
  <th>Attributes</th>
 </tr>
</thead>
<tbody>
 <tr>
  <td>

_types_</td>
  <td>A single root element.</td>
  <td></td>
 </tr>
 <tr>
  <td>

_import_</td>
  <td>An imported type definition.</th>
  <td>

- _name_: Name of the imported type.</li>
- _from_: The module from which the type is imported.</li>
- _link_: The link to a web page displayed in the documentation.</li>
  </td>
 </tr>
 <tr>
  <td>

_type_</td>
  <td>

A `@typedef` definition.</th>
  <td>

- _name_: A name of the type.</li>
- _desc_: A Description of the type.</li>
- _type_: A type of the type, if different from `Object`.</li>
- _noToc_: Do not include link to the type in the table of contents.</li>
- _spread_: Spread the type to the `{ prop: Type, prop2: Type2 }` notation when used as a `@param`.</li>
- _noExpand_: Do not expand the type when writing as a `@param` in _JSDoc_.</li>
  </td>
 </tr>
 <tr>
  <td>

_prop_</td>
  <td>

Property of a `@typedef` definition.</th>
  <td>

- _name_: Name of the property.</li>
- _string_: Whether the property is string.</li>
- _number_: Whether the property is number.</li>
- _boolean_: Whether the property is boolean.</li>
- _opt_: Whether the property is optional.</li>
- _default_: Default value of the property. When given, the property becomes optional.</li>
  </td>
 </tr>
</tbody>
</table>

### Migration

A JavaScript file can be scanned for the presence of `@typedef` JSDoc comments, which are then extracted to a `types.xml` file. This can be done with the [`doc src/index.js -e types/index.xml`](#extract-types) command. This is primarily a tool to migrate older software to using `types.xml` files which can be used both for [online documentation](#online-documentation) and [editor documentation](#editor-documentation).

For example, types can be extracted from a JavaScript file which contains JSDoc in form of comments:

```js
async function test() {
  process.stdout.write('ttt')
}

/**
 * @typedef {import('http').IncomingMessage} IncomingMessage
 */

/**
 * @typedef {(m: IncomingMessage)} Test This is test function.
 *
 * @typedef {Object} SessionConfig Description of Session Config.
 * @prop {string} key cookie key.
 * @prop {number|'session'} [maxAge=86400000] maxAge in ms. `session` will result in a cookie that expires when session/browser is closed.
 * @prop {boolean} [overwrite] Can overwrite or not. Default `true`.
 * @prop {boolean} [httpOnly] httpOnly or not or not. Default `true`.
 * @prop {boolean} [renew] Renew session when session is nearly expired, so we can always keep user logged in. Default `false`.
 */


export default test
```

When a description ends with <code>Default &#96;value&#96;</code>, the default value of a type can also be parsed from there.

```xml
Typal: smart typedefs https://artdecocode.com/typal/
Please use typal (included w/ Documentary):

typal example/extract.js -m
```