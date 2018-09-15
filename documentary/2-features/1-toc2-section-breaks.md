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
   <th>11</th>
  </tr>
 </thead>
 <tbody>
  <tr/>
  <tr>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/0.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/1.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/2.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/3.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/4.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/5.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/6.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/7.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/8.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/9.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/10.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/11.svg?sanitize=true"></td>
  </tr>
  <tr>
   <td align="center"><strong>12</strong></td>
   <td align="center"><strong>13</strong></td>
   <td align="center"><strong>14</strong></td>
   <td align="center"><strong>15</strong></td>
   <td align="center"><strong>16</strong></td>
   <td align="center"><strong>17</strong></td>
   <td align="center"><strong>18</strong></td>
   <td align="center"><strong>19</strong></td>
   <td align="center"><strong>20</strong></td>
   <td align="center"><strong>21</strong></td>
   <td align="center"><strong>22</strong></td>
  </tr>
  <tr>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/12.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/13.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/14.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/15.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/16.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/17.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/18.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/19.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/20.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/21.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/22.svg?sanitize=true"></td>
  </tr>
 </tbody>
</table>

<table>
 <thead>
  <tr>
   <th>-1</th>
   <th>-2</th>
   <th>-3</th>
  </tr>
 </thead>
 <tbody>
  <tr/>
  <tr>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/-1.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/-2.svg?sanitize=true"></td>
   <td><img src="https://raw.githubusercontent.com/artdecocode/documentary/HEAD/src/section-breaks/-3.svg?sanitize=true"></td>
  </tr>
 </tbody>
</table>

By default, the section brake will link to the table of contents, however this can be changed by setting the `href` attribute. The images are also SVGs therefore it is possible to give them any width via the `width` attribute and they will stretch without any loss of quality. _Documentary_ will copy images from its source code to the `.documentary/section-breaks` directory in the repository. To control the destination, set the `to` attribute on section breaks.

%~%