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

| Company | Tag Line | Evaluation & Exit |
| ------- | -------- | ----------------- |
| <a href="https://vwo.com">![VWO Logo](images/logos/vwo.png)</a> | A/B Testing and Conversion Optimization Platform™ | $10m, 2018 |
/**/
