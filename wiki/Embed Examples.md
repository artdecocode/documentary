_Documentary_ can be used to embed examples into the documentation. The example file needs to be specified with the following marker:

```
%EXAMPLE: example/example.js [, ../src => documentary] [, javascript]%
```

The first argument is the path to the example relative to the working directory of where the command was executed (normally, the project folder). The second optional argument is the replacement for the `import` statements (or `require` calls). The third optional argument is the markdown language to embed the example in and will be determined from the example extension if not specified.

Paths to JS files will be resolved. In other words, if the file is a _JavaScript_ source, its extension can be omitted, and if it's named `index.js`, only its folder can be passed. I.e., the following are the same:

```
%EXAMPLE: example/index.js%
%EXAMPLE: example%
```

---

Given the documentation section:

%EXAMPLE: example/examples.md%

And the example file `examples/example.js`

%EXAMPLE: example/example%

The program will produce the following output:

%FORK-md src/bin/doc example/examples.md%

Note how the `../src` import path was renamed into `documentary`. This makes documentation more user-friendly to the readers who can just copy-paste code.

%~%

## Partial Examples

Whenever only a part of an example needs to be shown (but the full code is still needed to be able to run it), _Documentary_ allows to use `start` and `end` comments to specify which part to print to the documentation. It will also make sure to adjust the indentation appropriately.

<table>
<tr><th>Example Source</th><th>Embedded As</th></tr>
<!-- block-start -->
<tr><td>

```js
import documentary from '../src'
import Catchment from 'catchment'

(async () => {
  /* start example */
  await documentary()
  /* end example */
})()
```
</td>
<td>

%EXAMPLE: example/example-partial%
</td></tr>
</table>