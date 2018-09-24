// picks up a link
[test](l)

/* matches */
[{"title": "test"}]
/**/

// picks up a link with prefix
[test](l-type)

/* matches */
[{"title": "test", "prefix": "type"}]
/**/

// picks up a link with a link before
[`import('child_process').ChildProcess`](https://nodejs.org/api/child_process.html#child_process_class_childprocess) __[`ChildProcess`](l)__

/* matches */
[{"title": "`ChildProcess`"}]
/**/