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
   <td><img src="src/breaks/11.svg"></td>
  </tr>
  <tr>
   <td>12</td>
   <td>13</td>
   <td>14</td>
   <td>15</td>
   <td>16</td>
   <td>17</td>
   <td>18</td>
   <td>19</td>
   <td>20</td>
   <td>21</td>
   <td>22</td>
  </tr>
  <tr>
   <td><img src="src/breaks/12.svg"></td>
   <td><img src="src/breaks/13.svg"></td>
   <td><img src="src/breaks/14.svg"></td>
   <td><img src="src/breaks/15.svg"></td>
   <td><img src="src/breaks/16.svg"></td>
   <td><img src="src/breaks/17.svg"></td>
   <td><img src="src/breaks/18.svg"></td>
   <td><img src="src/breaks/19.svg"></td>
   <td><img src="src/breaks/20.svg"></td>
   <td><img src="src/breaks/21.svg"></td>
   <td><img src="src/breaks/22.svg"></td>
  </tr>
 </tbody>
</table>


```table
[
  ["-1", "-2", "-3"],
  ["<img src='src/breaks/-1.svg'>", "<img src='src/breaks/-2.svg'>", "<img src='src/breaks/-3.svg'>"]
]
```

%~%