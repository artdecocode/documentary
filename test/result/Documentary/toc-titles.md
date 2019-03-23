## does not replace titles in the the inner code
`[Hello World](t)`

/* expected */
`[Hello World](t)`
/**/

## replaces a title link with an anchor
[Hello World](t)

/* expected */
<a name="hello-world">Hello World</a>
/**/

## replaces a title link with inner code
[`Hello World`](t)

/* expected */
<a name="hello-world">`Hello World`</a>
/**/

## replaces a title link with partial inner code
[Hello `World`](t)

/* expected */
<a name="hello-world">Hello `World`</a>
/**/

## replaces a title within a table row
```table
[
  ["A", "B"],
  ["hello `[no-replace](t)`", "world"],
  ["[\"[`Hello World`](t)\"]", "test"]
]
```

/* expected */
|            A            |   B   |
| ----------------------- | ----- |
| hello `[no-replace](t)` | world |
| ["<a name="hello-world">`Hello World`</a>"] | test  |
/**/