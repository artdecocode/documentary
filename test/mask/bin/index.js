// h1
test/mask/bin/h1.md -h1

/* expected */
# test

- [test](#test)
- [test2](#test2)
- [test3](#test3)

# test2

# test3

/**/

// underlined -h1
test/mask/bin/toc-underline.md -h1

/* expected */
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
test/mask/bin/toc-underline.md

/* expected */
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
test/mask/bin/macro.md

/* expected */

|                             Company                             |                     Tag Line                      | Evaluation & Exit |
| --------------------------------------------------------------- | ------------------------------------------------- | ----------------- |
| <a href="https://vwo.com">![VWO Logo](images/logos/vwo.png)</a> | A/B Testing and Conversion Optimization Platform™ | $10m, 2018        |
/**/

// prints in reverse order
test/fixtures/order -r

/* expected */
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

/* expected */
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