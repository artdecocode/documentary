// removes comments
The program will perform the necessary operations.
<!-- hello world -->
After halt, it will have produced the correct result.

/* expected */
The program will perform the necessary operations.
After halt, it will have produced the correct result.
/**/

// removes multiple comments
<!-- test -->Hello World<!-- test -->

/* expected */
Hello World
/**/

// does not remove comments surrounded by backticks
Text surrounded by the `<!--` and `-->` blocks is not removed.

/* expected */
Text surrounded by the `<!--` and `-->` blocks is not removed.
/**/

// removes comments with code blocks
<!--
```
const t = 'new test value: '
const s = t + 'test'
console.log(s)
```
 -->
```
console.log('hello')
```
<!--
```
const t = 'new test value: '
const s = t + 'test'
console.log(s)
```
 -->

/* expected */
```
console.log('hello')
```

/**/

// does not remove comments from code blocks
```
<!-- hello world -->
```

/* expected */
```
<!-- hello world -->
```
/**/