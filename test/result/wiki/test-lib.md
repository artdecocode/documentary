<!-- Mask file: test/mask/run.js -->

## non-narrow details
test/result/wiki/data-details

/* expected */
# index.md

Hello World

<details>
 <summary><strong><a name="type-_nstypebsans"><code>_ns.TypeBSans</code></a></strong></summary>

|      Name      |    Type    | Description |
| -------------- | ---------- | ----------- |
| __test-prop*__ | <em>*</em> |             |
</details>
/**/

## processes wiki with directories
test/result/wiki/data-dir

/* expected */
# PageA.md

Hello World Page A

<strong><a name="type-_nstypea">`_ns.TypeA`</a></strong>: A new type.
<table>
 <thead><tr>
  <th>Name</th>
  <th>Type &amp; Description</th>
 </tr></thead>
 <tr>
  <td rowSpan="3" align="center"><strong>prop1*</strong></td>
  <td><em><a href="PageB#type-_nstypeb" title="A type for page B.">_ns.TypeB</a></em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   A property.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><strong>prop2*</strong></td>
  <td><em><a href="PageB#type-_nstypebsans">_ns.TypeBSans</a></em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Linking to the type without description.
  </td>
 </tr>
</table>

# PageB.md

Hello World Page B

<strong><a name="type-_nstypeb">`_ns.TypeB`</a></strong>: A type for page B.


<details>
 <summary><strong><a name="type-_nstypebsans"><code>_ns.TypeBSans</code></a></strong></summary>
<table>
 <thead><tr>
  <th>Name</th>
  <th>Type &amp; Description</th>
 </tr></thead>
 <tr>
  <td rowSpan="3" align="center"><strong>test-prop*</strong></td>
  <td><em>*</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td></td>
 </tr>
</table>
</details>
/**/