// links types across files
test/fixture/typedef/documentary

/* expected */
## The Server Config

__<a name="serverconfig">`ServerConfig`</a>__: Options to setup the server.

|       Name        |      Type      |               Description                | Default |
| ----------------- | -------------- | ---------------------------------------- | ------- |
| port              | _number_       | The port on which to run the server.     | `8888`  |
| __staticConfig*__ | _[StaticConfig](#staticconfig)_ | The configuration for the static server. | -       |

## The Static Config

`import('http').ServerResponse` __<a name="serverresponse">`ServerResponse`</a>__

`(res: ServerResponse) => any` __<a name="setheaders">`SetHeaders`</a>__: Function to set custom headers on response.

__<a name="staticconfig">`StaticConfig`</a>__: Options to setup `koa-static`.

|    Name    |            Type             |                 Description                 | Default |
| ---------- | --------------------------- | ------------------------------------------- | ------- |
| setHeaders | [_SetHeaders_](#setheaders) | Function to set custom headers on response. | -       |
/**/