### `Toc` Stream

`Toc` is a transform stream which can generate a table of contents for incoming markdown data. For every title that the transform sees, it will push the appropriate level of the table of contents.

### `TocConfig` Type

When creating a new `Toc` instance, it will accept the following configuration object.
%TYPE true
<p name="skipLevelOne" type="boolean">
  <d>Start the table of contents from level 2, i.e., excluding the <code>#</code> title.</d>
  <e>For example, the following code:

```md
# Hello World

## Table Of Contents

## Introduction
```

will be compiled to

%FORK-md example example/toc2.js%

when `skipLevelOne` is not set (default true), and to

%FORK-md example example/toc2.js -s%

when `skipLevelOne` is set to `false`.
</e>
</p>
%

```### constructor => Toc
[
  ["config?", {
    "skipLevelOne?": ["boolean", "true"]
  }]
]
```

Create a new instance of a `Toc` stream.

%EXAMPLE: example/toc.js, ../src => documentary, javascript%

%FORK-fs example example/toc.js%
