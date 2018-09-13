
#### Migration

A JavaScript file can be scanned for the presence of `@typedef` JSDoc comments, which are then extracted to a `types.xml` file. This can be done with the [`doc src/index.js -e types/index.xml`](#extract-types) command. This is primarily a tool to migrate older software to using `types.xml` files which can be used both for [online documentation](#online-documentation) and [editor documentation](#editor-documentation).

For example, types can be extracted from a JavaScript file which contains JSDoc in form of comments:

%EXAMPLE: example/extract.js%

When a description ends with <code>Default &#96;value&#96;</code>, the default value of a type can also be parsed from there.

%FORK-xml src/bin/alamode example/extract.js -e -%
