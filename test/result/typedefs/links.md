// can link piped types
%TYPEDEF test/fixture/typedef/pipe.xml%

/* expected */
__[`Type`](t-type)__
__[`Type2`](t-type)__

```table
[["Name","Type","Description","Default"],["__prop*__","_string\\|[Type](#type-type)_","A property.","-"]]
```
/**/

// can link promised types
%TYPEDEF test/fixture/typedef/promise.xml%

/* expected */
__[`Type`](t-type)__
__[`Type2`](t-type)__
__[`Type3`](t-type)__
__[`Type4`](t-type)__
__[`Type5`](t-type)__

```table
[["Name","Type","Description","Default"],["__prop*__","_Promise.&lt;[Type](#type-type)\\|[Type2](#type-type2)&gt;\\|[Type3](#type-type3)\\|[Type4](#type-type4)_","A property.","-"]]
```
/**/