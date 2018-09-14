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

### Section Breaks

A section break is a small image in the center of the page which indicates the end of a section. With larger sections which also include sub-sections, this feature can help to differentiate when the topic finishes and another one starts. They can also be used to navigate back to the table of contents, or a specified location.

At the moment, there is support for pre-installed section breaks. In future, more support of custom images will be included.

To insert a section brake, the following marker is used:

```
%~[, number[, attributes]]%
```

For example:

%EXAMPLE: example/section-breaks/index.md%

%FORK src/bin/alamode example/section-breaks/index.md%

There are 23 available section breaks which will be inserted in incremental order in the document. When the end of the list is reached, the count restarts. There are also 3 ending breaks which can be inserted at the end and do not participate in the rotation, so that they must be inserted manually. To select a specific image, its number can be given.

<table>
 <thead>
  <tr>
   <th>0</th>
   <th>1</th>
   <th>2</th>
   <th>3</th>
   <th>4</th>
   <th>5</th>
   <th>6</th>
   <th>7</th>
   <th>8</th>
   <th>9</th>
   <th>10</th>
  </tr>
 </thead>
 <tbody>
  <tr>
   <td><img src="src/breaks/0.svg"></td>
   <td><img src="src/breaks/1.svg"></td>
   <td><img src="src/breaks/2.svg"></td>
   <td><img src="src/breaks/3.svg"></td>
   <td><img src="src/breaks/4.svg"></td>
   <td><img src="src/breaks/5.svg"></td>
   <td><img src="src/breaks/6.svg"></td>
   <td><img src="src/breaks/7.svg"></td>
   <td><img src="src/breaks/8.svg"></td>
   <td><img src="src/breaks/9.svg"></td>
   <td><img src="src/breaks/10.svg"></td>
  </tr>
 </tbody>
</table>


```table
[
  ["-1", "-2", "-3"],
  ["<img scr='src/breaks/-1.svg'>", "<img scr='src/breaks/-2.svg'>", "<img scr='src/breaks/-3.svg'>"]
]
```

%~%