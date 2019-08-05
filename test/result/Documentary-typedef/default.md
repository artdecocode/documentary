## places a single type
%TYPEDEF test/fixture/typedef/types.xml StaticConfig%

/* expected */
__<a name="type-staticconfig">`StaticConfig`</a>__: Options to setup `koa-static`.

|    Name    |        Type         |                 Description                 |   Default    |
| ---------- | ------------------- | ------------------------------------------- | ------------ |
| __root*__  | <em>string</em>     | Root directory string.                      | -            |
| maxage     | <em>number</em>     | Browser cache max-age in milliseconds.      | `0`          |
| hidden     | <em>boolean</em>    | Allow transfer of hidden files.             | `false`      |
| index      | <em>string</em>     | Default file name.                          | `index.html` |
| setHeaders | <em>SetHeaders</em> | Function to set custom headers on response. | -            |
/**/

## escapes a | in type's property
%TYPEDEF test/fixture/typedef/types-pipe.xml SessionConfig%

/* expected */
__<a name="type-sessionconfig">`SessionConfig`</a>__: Options to setup `koa-session`.

|    Name     |              Type              |             Description             |
| ----------- | ------------------------------ | ----------------------------------- |
| __maxAge*__ | <em>(number \| 'session')</em> | maxAge in ms with default of 1 day. |
/**/

## places a single type without properties
%TYPEDEF test/fixture/typedef/types.xml SetHeaders%

/* expected */
`(res: ServerResponse) => any` __<a name="type-setheaders">`SetHeaders`</a>__: Function to set custom headers on response.
/**/

## places all types from a file
%TYPEDEF test/fixture/typedef/types.xml%

/* expected */
[`import('http').ServerResponse`](https://nodejs.org/api/http.html#http_class_http_serverresponse) __<a name="type-httpserverresponse">`http.ServerResponse`</a>__: A writable stream that communicates data to the client. The second argument of the http.Server.on("request") event.

`(res: ServerResponse) => any` __<a name="type-setheaders">`SetHeaders`</a>__: Function to set custom headers on response.

__<a name="type-staticconfig">`StaticConfig`</a>__: Options to setup `koa-static`.

|    Name    |                                                  Type                                                  |                 Description                 |   Default    |
| ---------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------- | ------------ |
| __root*__  | <em>string</em>                                                                                        | Root directory string.                      | -            |
| maxage     | <em>number</em>                                                                                        | Browser cache max-age in milliseconds.      | `0`          |
| hidden     | <em>boolean</em>                                                                                       | Allow transfer of hidden files.             | `false`      |
| index      | <em>string</em>                                                                                        | Default file name.                          | `index.html` |
| setHeaders | <em><a href="#type-setheaders" title="Function to set custom headers on response.">SetHeaders</a></em> | Function to set custom headers on response. | -            |
/**/