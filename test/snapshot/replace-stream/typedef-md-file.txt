`import('http').ServerResponse` __<a name="serverresponse">`ServerResponse`</a>__

`(res: ServerResponse) => any` __<a name="setheaders">`SetHeaders`</a>__: Function to set custom headers on response.

__<a name="staticconfig">`StaticConfig`</a>__: Options to setup `koa-static`.

| Name | Type | Description | Default |
| ---- | ---- | ----------- | ------- |
| __root*__ | _string_ | Root directory string. | - |
| maxage | _number_ | Browser cache max-age in milliseconds. | `0` |
| hidden | _boolean_ | Allow transfer of hidden files. | `false` |
| index | _string_ | Default file name. | `index.html` |
| setHeaders | [_SetHeaders_](#setheaders) | Function to set custom headers on response. | - |