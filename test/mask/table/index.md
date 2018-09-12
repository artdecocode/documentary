// replaces the table
```table
[
  ["arg", "description"],
  ["-f", "Display only free domains"],
  ["-z", "A list of zones to check"]
]
```

/* expected */
| arg | description |
| --- | ----------- |
| -f | Display only free domains |
| -z | A list of zones to check |
/**/

// replaces the table with whitespace
```table

[
  ["arg", "description"],
  ["-f", "Display only free domains"],
  ["-z", "A list of zones to check"]
]

```

/* expected */
| arg | description |
| --- | ----------- |
| -f | Display only free domains |
| -z | A list of zones to check |
/**/

// returns the match when cannot parse
```table
match with invalid table
```

/* expected */
```table
match with invalid table
```
/**/

// replaces the with a macro
%TABLE-MACRO TEST
test-$1, test-$2, test-$3\, test-$4
%
```table TEST
[
  ["A", "B", "C"],
  ["one", "two", "three", "four"],
  ["2one", "2two", "2three", "2four"]
]
```

/* expected */
| A | B | C |
| - | - | - |
| test-one | test-two | test-three, test-four |
| test-2one | test-2two | test-2three, test-2four |
/**/
