// links types across files
test/fixture/typedef/documentary

/* expected */
__[`ServerConfig`](t)__: Options to setup the server.

```table
[["Name","Type","Description","Default"],["port","_number_","The port on which to run the server.","`8888`"],["__staticConfig*__","[_StaticConfig_](#staticconfig)","The configuration for the static server.","-"]]
```
`(res: ServerResponse) => any` __[`SetHeaders`](t)__: Function to set custom headers on response.
__[`StaticConfig`](t)__: Options to setup `koa-static`.

```table
[["Name","Type","Description","Default"],["setHeaders","[_SetHeaders_](#setheaders)","Function to set custom headers on response.","-"]]
```
`import('http').ServerResponse` __[`ServerResponse`](l)__
__[`Type1`](t)__
__[`Type2`](t)__
/**/

/* locations */
["test/fixture/typedef/types/1.xml",
 "test/fixture/typedef/types/2.xml",
 "test/fixture/typedef/types/3.xml"]
/**/