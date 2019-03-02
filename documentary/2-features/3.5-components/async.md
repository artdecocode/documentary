### Async Components

The components can be rendered asynchronously when the component returns a promise. _Documentary_ will wait for the promise to resolve before attempting to render JSX into HTML. Only the root component can be asynchronous, and if it uses other components in its JSX, they must be synchronous.

```js
<Source src="src/index.js" />
```