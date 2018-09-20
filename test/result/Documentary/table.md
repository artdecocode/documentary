// replaces a table
The program accepts the following arguments:

```table
[
  ["arg", "description"],
  ["-f", "Display only free domains"],
  ["-z", "A list of zones to check"]
]
```

/* expected */
The program accepts the following arguments:

| arg |        description        |
| --- | ------------------------- |
| -f  | Display only free domains |
| -z  | A list of zones to check  |
/**/


// replaces a table with null data
The program accepts the following arguments:

```table
[
  ["arg", "description"],
  ["-f", null],
  ["-z", null]
]
```

/* expected */
The program accepts the following arguments:

| arg | description |
| --- | ----------- |
| -f  |             |
| -z  |             |
/**/

// replaces a table with a macro
%TABLE-MACRO Company
  $1
%
```table Company
[
  ["Test"],
  ["test"]
]
```

/* expected */
| Test |
| ---- |
| test |
/**/

// replaces a table with inner code in data
%TABLE-MACRO Company
  $1
%
```table Company
[
  ["Test"],
  ["hello `world`"]
]
```

/* expected */
|     Test      |
| ------------- |
| hello `world` |
/**/

// replaces a table with inner code in macro
%TABLE-MACRO Company
  `$1`
%
```table Company
[
  ["Test"],
  ["hello world"]
]
```

/* expected */
|     Test      |
| ------------- |
| `hello world` |
/**/

// replaces followed by a code block
The program accepts the following arguments:

```table
[
  ["arg", "description"],
  ["-f", "Display only free domains"],
  ["-z", "A list of zones to check"]
]
```
```
const t = 'new test value: '
const s = t + 'test'
console.log(s)
```

/* expected */
The program accepts the following arguments:

| arg |        description        |
| --- | ------------------------- |
| -f  | Display only free domains |
| -z  | A list of zones to check  |
```
const t = 'new test value: '
const s = t + 'test'
console.log(s)
```
/**/

// replaces multiple tables
```table
[
  ["arg", "description"],
  ["-f", "Display only free domains"],
  ["-z", "A list of zones to check"]
]
```

```table
[
  ["arg", "description"],
  ["-f", "Display only free domains"],
  ["-z", "A list of zones to check"]
]
```

/* expected */
| arg |        description        |
| --- | ------------------------- |
| -f  | Display only free domains |
| -z  | A list of zones to check  |

| arg |        description        |
| --- | ------------------------- |
| -f  | Display only free domains |
| -z  | A list of zones to check  |
/**/