### TOC Generation

Table of contents are useful for navigation the README document. When a `%TOC%` placeholder is found in the file, it will be replaced with an extracted structure. Titles appearing in comments and code blocks will be skipped.

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

<!-- To be able to include a link to a specific position in the text (i.e., create an "anchor"), `documentary` provides with a toc- -->
