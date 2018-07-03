# documentary

[![npm version](https://badge.fury.io/js/%40adc%2Fdocumentary.svg)](https://npmjs.org/package/@adc/documentary)

A package to manage documentation of Node.js packages.

## Table Of Contents

%TOC%

## CLI

The `doc` client is available after installation.

### `-j`, `--jsdoc`: Add JSDoc

Update the file to include jsdoc documentation. E.g., can be used to update build files with jsdoc information from the source code. Because `_interopRequire` is a runtime call, the type is not not kept by Visual Studio Code, when a file in `build` directory exports a method from another file.

By keeping JSDoc types separate, and automatically adding them to the build files, it is easier to maintain the JSDoc documentation, as types can be put into the `types` folder.

## API

To require documentary, use `import` statement:

```js
import documentary from 'documentary'
```

`documentary` has the following features:

| feature | description |
| ------- | ----------- |
| toc | Generates a table of contents |
| tables | Display markdown tables |
| comments | Removes comments |

#### `async runSoftware(`<br/>&nbsp;&nbsp;`string: path,`<br/>&nbsp;&nbsp;`config: {`<br/>&nbsp;&nbsp;&nbsp;&nbsp;`View: Container,`<br/>&nbsp;&nbsp;&nbsp;&nbsp;`actions: object,`<br/>&nbsp;&nbsp;&nbsp;&nbsp;`static?: boolean = true,`<br/>&nbsp;&nbsp;&nbsp;&nbsp;`render?: function,`<br/>&nbsp;&nbsp;`},`<br/>`): string`

## Example

This section will embed an example.

```javascript
import documentary from 'documentation'
import Catchment from 'catchment'

(async () => {
  await documentary()
})()
```

```js
## titles from code blocks with language are not included
```
```
## titles from code blocks without language are not included
```
```json
{
  "hello": "world"
}
```

## Copyright

[Art Deco](https://artdeco.bz) 2018