## links types across files
test/fixture/typedef/documentary

/* expected */
__[`ServerConfig`](t-type)__: Options to setup the server.

```table
[
  [
    "Name",
    "Type",
    "Description",
    "Default"
  ],
  [
    "port",
    "<em>number</em>",
    "The port on which to run the server.",
    "`8888`"
  ],
  [
    "__staticConfig*__",
    "<em>[StaticConfig](#type-staticconfig)</em>",
    "The configuration for the static server.",
    "-"
  ]
]
```
`import('http').ServerResponse` __[`http.ServerResponse`](l-type)__
`(res: ServerResponse) => any` __[`SetHeaders`](t-type)__: Function to set custom headers on response.
__[`StaticConfig`](t-type)__: Options to setup `koa-static`.

```table
[
  [
    "Name",
    "Type",
    "Description"
  ],
  [
    "setHeaders",
    "<em>[SetHeaders](#type-setheaders)</em>",
    "Function to set custom headers on response."
  ]
]
```
__[`Type2`](t-type)__
/**/

/* locations */
["test/fixture/typedef/types/1.xml",
 "test/fixture/typedef/types/2.xml",
 "test/fixture/typedef/types/3.xml"]
/**/