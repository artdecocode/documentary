## places a single type
%TYPEDEF test/fixture/typedef/types.xml StaticConfig%

/* expected */
__<a name="type-staticconfig">`StaticConfig`</a>__: Options to setup `koa-static`.

|    Name    |     Type     |                 Description                 |   Default    |
| ---------- | ------------ | ------------------------------------------- | ------------ |
| __root*__  | _string_     | Root directory string.                      | -            |
| maxage     | _number_     | Browser cache max-age in milliseconds.      | `0`          |
| hidden     | _boolean_    | Allow transfer of hidden files.             | `false`      |
| index      | _string_     | Default file name.                          | `index.html` |
| setHeaders | _SetHeaders_ | Function to set custom headers on response. | -            |
/**/

## escapes a | in type's property
%TYPEDEF test/fixture/typedef/types-pipe.xml SessionConfig%

/* expected */
__<a name="type-sessionconfig">`SessionConfig`</a>__: Options to setup `koa-session`.

|    Name     |         Type          |             Description             |
| ----------- | --------------------- | ----------------------------------- |
| __maxAge*__ | _number \| 'session'_ | maxAge in ms with default of 1 day. |
/**/

## places a single type without properties
%TYPEDEF test/fixture/typedef/types.xml SetHeaders%

/* expected */
`(res: ServerResponse) => any` __<a name="type-setheaders">`SetHeaders`</a>__: Function to set custom headers on response.
/**/

## places all types from a file
%TYPEDEF test/fixture/typedef/types.xml%

/* expected */
`import('http').ServerResponse` __<a name="type-httpserverresponse">`http.ServerResponse`</a>__

`(res: ServerResponse) => any` __<a name="type-setheaders">`SetHeaders`</a>__: Function to set custom headers on response.

__<a name="type-staticconfig">`StaticConfig`</a>__: Options to setup `koa-static`.

|    Name    |               Type               |                 Description                 |   Default    |
| ---------- | -------------------------------- | ------------------------------------------- | ------------ |
| __root*__  | _string_                         | Root directory string.                      | -            |
| maxage     | _number_                         | Browser cache max-age in milliseconds.      | `0`          |
| hidden     | _boolean_                        | Allow transfer of hidden files.             | `false`      |
| index      | _string_                         | Default file name.                          | `index.html` |
| setHeaders | _[SetHeaders](#type-setheaders)_ | Function to set custom headers on response. | -            |
/**/