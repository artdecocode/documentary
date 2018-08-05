
#### Migration

A JavaScript file can be scanned for the presence of `@typedef` JSDoc comments, and then extracted to a `types.xml` file. This can be done with the [`doc src/index.js -e types/index.xml`](t) command. This is primarily a tool to migrate older software to using `types.xml` files which can be used both for [online documentation](#online-documentation) and [editor documentation](#editor-documentation).

For example, types can be extracted from a JavaScript file which contains JSDoc in form of comments:

%EXAMPLE: test/fixtures/typedef/extract.js, ../src => src, js%

When a description ends with <code>Default `true`</code>, the default value of a type can also be parsed from there.

%FORK-xml src/bin/register test/fixtures/typedef/extract.js -e -%
