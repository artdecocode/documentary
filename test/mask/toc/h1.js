// supports underlined titles
Test
====
 `test`
test2
-----
 #test3
-----

/* expected */
- [Test](#test)
  * [`test`<br/>test2](#testtest2)
  * [#test3](#test3)

/**/

// does not detect underlined empty line
Test
====
test2
-----

---

/* expected */
- [Test](#test)
  * [test2](#test2)

/**/