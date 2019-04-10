// h1
test/result/bin/h1.md -h1

/* stdout */
# test

- [test](#test)
- [test2](#test2)
- [test3](#test3)

# test2

# test3
/**/

// underlined -h1
test/result/bin/toc-underline.md -h1

/* stdout */
Test
====

- [Test](#test)
  * [`test`<br/>test2](#testtest2)
  * [#test3](#test3)
- [test4](#test4)

 `test`
test2
-----
 #test3
-----

# test4
/**/

// underlined
test/result/bin/toc-underline.md

/* stdout */
Test
====

- [`test`<br/>test2](#testtest2)
- [#test3](#test3)

 `test`
test2
-----
 #test3
-----

# test4
/**/

// macro
test/result/bin/macro.md

/* stdout */

|                             Company                             |                     Tag Line                      | Evaluation & Exit |
| --------------------------------------------------------------- | ------------------------------------------------- | ----------------- |
| <a href="https://vwo.com">![VWO Logo](images/logos/vwo.png)</a> | A/B Testing and Conversion Optimization Platform™ | $10m, 2018        |
/**/

// prints in reverse order
test/fixtures/order -r

/* stdout */
## index

- [index](#index)
- [30-file](#30-file)
- [25-file](#25-file)
- [footer](#footer)

## 30-file

## 25-file

## footer
/**/

// generates correct markdown from a directory
test/fixtures/README

/* stdout */
# readme

This is a composite documentation split into multiple files.

## a hidden file

is a real treasure

## Introduction

Before software can be reusable it first has to be usable. (Ralph Johnson)

## Debugging

Debugging is an essential part of development process.

### VS Code

Debugging with VS Code is made possible with `launch.json` configuration file.


---

(c) Art Deco Code 2018
/**/

// prints the TOC with -t flag
test/fixtures/README-source.md -t

/* stdout */
- [Table Of Contents](#table-of-contents)
- [CLI](#cli)
  * [`-j`, `--jsdoc`: Add JSDoc](#-j---jsdoc-add-jsdoc)
- [API](#api)
    * [`async runSoftware(string: path, config: Config): string`](#async-runsoftwarestring-pathconfig-view-containeractions-objectstatic-boolean--truerender-function-string)
- [Example](#example)
- [Copyright](#copyright)
/**/

// links types across files
test/fixture/typedef/documentary

/* stdout */
## The Server Config

__<a name="type-serverconfig">`ServerConfig`</a>__: Options to setup the server.

|       Name        |                 Type                 |               Description                | Default |
| ----------------- | ------------------------------------ | ---------------------------------------- | ------- |
| port              | _number_                             | The port on which to run the server.     | `8888`  |
| __staticConfig*__ | _[StaticConfig](#type-staticconfig)_ | The configuration for the static server. | -       |

## The Static Config

`import('http').ServerResponse` __<a name="type-httpserverresponse">`http.ServerResponse`</a>__

`(res: ServerResponse) => any` __<a name="type-setheaders">`SetHeaders`</a>__: Function to set custom headers on response.

__<a name="type-staticconfig">`StaticConfig`</a>__: Options to setup `koa-static`.

|    Name    |               Type               |                 Description                 |
| ---------- | -------------------------------- | ------------------------------------------- |
| setHeaders | _[SetHeaders](#type-setheaders)_ | Function to set custom headers on response. |

__<a name="type-type2">`Type2`</a>__
/**/