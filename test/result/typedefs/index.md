// links types across files
test/fixture/typedef/documentary

/* expected */
__[`ServerConfig`](t)__: Options to setup the server.

```table
[["Name","Type","Description","Default"],["port","_number_","The port on which to run the server.","`8888`"],["__staticConfig*__","_[StaticConfig](#staticconfig)_","The configuration for the static server.","-"]]
```
`import('http').ServerResponse` __[`ServerResponse`](l)__
`(res: ServerResponse) => any` __[`SetHeaders`](t)__: Function to set custom headers on response.
__[`StaticConfig`](t)__: Options to setup `koa-static`.

```table
[["Name","Type","Description","Default"],["setHeaders","_[SetHeaders](#setheaders)_","Function to set custom headers on response.","-"]]
```
__[`Type2`](t)__
/**/

/* locations */
["test/fixture/typedef/types/1.xml",
 "test/fixture/typedef/types/2.xml",
 "test/fixture/typedef/types/3.xml"]
/**/