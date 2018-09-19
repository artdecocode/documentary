// can link piped types
test/fixture/typedef/pipe/index.md

/* expected */
__[`Type`](t)__
__[`Type2`](t)__

```table
[["Name","Type","Description","Default"],["__prop*__","_string\\|[Type](#type)_","A property.","-"]]
```
/**/

// can link promised types
test/fixture/typedef/promise/index.md

/* expected */
__[`Type`](t)__
__[`Type2`](t)__
__[`Type3`](t)__
__[`Type4`](t)__
__[`Type5`](t)__

```table
[["Name","Type","Description","Default"],["__prop*__","_Promise.&lt;[Type](#type)\\|[Type2](#type2)&gt;\\|[Type3](#type3)\\|[Type4](#type4)_","A property.","-"]]
```
/**/