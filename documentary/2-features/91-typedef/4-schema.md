
#### XML Schema

The XML file should have the following nodes and attributes:

<table>
<thead>
 <tr>
  <th>Node</th>
  <th>Description</th>
  <th>Attributes</th>
 </tr>
</thead>
<tbody>
 <tr>
  <td>

_types_</td>
  <td>A single root element.</td>
  <td></td>
 </tr>
 <tr>
  <td>

_import_</td>
  <td>An imported type definition.</th>
  <td>

- _name_: Name of the imported type.</li>
- _from_: The module from which the type is imported.</li>
  </td>
 </tr>
 <tr>
  <td>

_type_</td>
  <td>

A `@typedef` definition.</th>
  <td>

- _name_: A name of the type.</li>
- _desc_: A Description of the type.</li>
- _type_: A type of the type, if different from `Object`.</li>
- _noToc_: Do not include link to the type in the table of contents.</li>
- _spread_: Spread the type to the `{ prop: Type, prop2: Type2 }` notation when used as a `@param`.</li>
- _noExpand_: Do not expand the type when writing as a `@param` in _JSDoc_.</li>
  </td>
 </tr>
 <tr>
  <td>

_prop_</td>
  <td>

Property of a `@typedef` definition.</th>
  <td>

- _name_: Name of the property.</li>
- _string_: Whether the property is string.</li>
- _number_: Whether the property is number.</li>
- _boolean_: Whether the property is boolean.</li>
- _opt_: Whether the property is optional.</li>
- _default_: Default value of the property. When given, the property becomes optional.</li>
  </td>
 </tr>
</tbody>
</table>
