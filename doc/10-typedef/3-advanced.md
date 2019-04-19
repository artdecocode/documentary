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