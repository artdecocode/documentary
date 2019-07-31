Table of contents are useful for navigation in a README document. When a `%TOC%` placeholder is found in files, it will be replaced with an extracted structure. Titles appearing in comments and code blocks will be skipped.

## On This Page

%TOC%

%~%

By default, top level `h1` headers written with `#` are ignored, but they can be added by passing `-h1` [CLI argument](#h1-in-toc).

When the page does not contain `Table Of Contents` heading at any level, the `<a name="table-of-contents"></a>` line will be added to generated documentation, so that it can be jumped to from [[Section Breaks]].

<!-- ```sh
doc -t input-source.md [-r] [-o output.md]
``` -->

_Example of generated table of contents:_

```markdown
- [Table Of Contents](#table-of-contents)
- [CLI](#cli)
  * [`-j`, `--jsdoc`: Add JSDoc](#-j---jsdoc-add-jsdoc)
- [API](#api)
- [Copyright](#copyright)
```

%~%

## TOC Titles

To be able to include a link to a specific position in the text (i.e., create an "anchor"), _Documentary_ has the `TOC Titles` feature. Any text written as `[Toc Title](t)` will generate a relevant position in the table of contents. It will automatically detect the appropriate level and be contained inside the current section.

This feature can be useful when presenting some data in a table in a section, but wanting to include a link to each row in the table of contents so that the structure is immediately visible.

**[Auto Level TOC Titles](t)**: by default, when the `[Heading](t)` toc-title is detected, it will appear on the next level of TOC, relative to non-toc-titles. E.g., specifying 2 toc-titles in a row won't lead to their nesting since their position is relative to the actual title written as `# Title` (or `<h1>Title</h1>`) in markdown.

**[Specific Level TOC Titles](##)**: if required, the level can be specified with a number of `#` symbols, such as `[Specific Level](##)`.

_For example, with the following document_:

%EXAMPLE: example/toc.md%

_the table of contents below will be generated_:

%FORK-md src/bin/doc example/toc.md -t%