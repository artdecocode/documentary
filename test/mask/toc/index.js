// gets titles from a table with a macro
## test

%TABLE-MACRO macro
[$1](t)
%
```table macro
[
  ["A"],
  ["test2"]
]
```

/* expected */
- [test](#test)
  * [test2](#test2)

/**/

// does not generate titles for titles in comments
````
```### async runSoftware => string
[
  ["path", "string"],
  ["config", {
    "View": ["Container"],
    "actions": ["object"],
    "static?": ["boolean", true],
    "render?": ["function"]
  }]
]
```
````
## test

/* expected */
- [test](#test)

/**/

// does not generate titles for commented blocks
<!--
## Hello World
 -->
## test

/* expected */
- [test](#test)

/**/

// supports titles
## Title
 Something's going on here.
 Hello this is a [Toc Title](t).

/* expected */
- [Title](#title)
  * [Toc Title](#toc-title)

/**/

// supports titles with explicit level

## Title
 Something's going on here.
 Hello this is a [Toc Title](##).

/* expected */
- [Title](#title)
- [Toc Title](#toc-title)

/**/

// supports titles found in a table
## `Hello World` Title
```table
[
  [
    "hello `[no match](t)`",
    "world"
  ],
  [
    "[`Toc Title`](t)",
    "test"
  ]
]
```

/* expected */
- [`Hello World` Title](#hello-world-title)
  * [`Toc Title`](#toc-title)

/**/

// supports underlined titles
Test
====
 `test`
test2
-----
 #test3
-----

/* expected */
- [`test`<br/>test2](#testtest2)
- [#test3](#test3)

/**/

// method title with an argument
```#### async runSoftware
[
  ["path", "string"]
]
```

/* expected */
    * [`async runSoftware(path: string)`](#async-runsoftwarepath-string-void)

/**/

// method title without arguments
```#### runSoftware => string
```

/* expected */
    * [`runSoftware(): string`](#runsoftware-string)

/**/

// method title without arguments with a follow-up
```#### runSoftware => string
```
Generated from
```

/* expected */
    * [`runSoftware(): string`](#runsoftware-string)

/**/
