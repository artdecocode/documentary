// replaces local
%EXAMPLE: test/mask/example/replace-local.js, ../src => pass%

/* expected */
```js
import test from 'pass'
const test = require('pass')
```
/**/

// replaces global
%EXAMPLE: test/mask/example/replace-global.js, test => pass%

/* expected */
```js
import test from 'pass'
const test = require('pass')
```
/**/
