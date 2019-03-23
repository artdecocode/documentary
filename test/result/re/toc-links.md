## picks up a toc link
[test](t)

/* matches */
[{"title": "test", "tOrHash": "t"}]
/**/

## picks up a toc link with hash
[test](##)

/* matches */
[{"title": "test", "tOrHash": "##"}]
/**/

## picks up a toc link with prefix
[test](t-type)

/* matches */
[{"title": "test", "tOrHash": "t", "prefix": "type"}]
/**/
