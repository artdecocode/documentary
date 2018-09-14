## **TOC Generation**

Table of contents are useful for navigation in a README document. When a `%TOC%` placeholder is found in the file, it will be replaced with an extracted structure. Titles appearing in comments and code blocks will be skipped.

By default, top level `h1` headers written with `#` are ignored, but they can be added by passing `-h1` [CLI argument](#h1-in-toc).

<!-- ```sh
doc -t input-source.md [-r] [-o output.md]
``` -->

```md
- [Table Of Contents](#table-of-contents)
- [CLI](#cli)
  * [`-j`, `--jsdoc`: Add JSDoc](#-j---jsdoc-add-jsdoc)
- [API](#api)
- [Copyright](#copyright)
```

### TOC Titles

To be able to include a link to a specific position in the text (i.e., create an "anchor"), _Documentary_ has a `TOC Titles` feature. Any text written as `[Toc Title](t)` will generate a relevant position in the table of contents. It will automatically detect the appropriate level and be contained inside the current section.

This feature can be useful when presenting some data in a table in a section, but wanting to include a link to each row in the table of contents so that the structure is immediately visible.

**[Level TOC Titles](###)**: if required, the level can be specified with a number of `#` symbols, such as `[Specific Level](###)`.