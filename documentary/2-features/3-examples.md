## **Examples Placement**

_Documentary_ can be used to embed examples into the documentation. The example file needs to be specified with the following marker:

```
%EXAMPLE: example/example.js [, ../src => documentary] [, javascript]%
```

The first argument is the path to the example relative to the working directory of where the command was executed (normally, the project folder). The second optional argument is the replacement for the `import` statements (or `require` calls). The third optional argument is the markdown language to embed the example in and will be determined from the example extension if not specified.

Given the documentation section:

%EXAMPLE: example/examples.md%

And the example file `examples/example.js`

%EXAMPLE: example/example.js%

The program will produce the following output:

%FORK-md src/bin/alamode example/examples.md%

### Partial Examples

Whenever only a part of an example needs to be shown (but the full code is still needed to be able to run it), `documentary` allows to use `start` and `end` comments to specify which part to print to the documentation. It will also make sure to adjust the indentation appropriately.

```js
import documentary from '../src'
import Catchment from 'catchment'

(async () => {
  /* start example */
  await documentary()
  /* end example */
})()
```

%EXAMPLE: example/example-partial.js%
