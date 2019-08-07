## creates typedef for methods
<typedef narrow>test/temp/types.xml</typedef>

/* types */
<types>
  <type name="Test">
    <prop type="string|Linked" name="nodeName">NodeName</prop>
    <fn args="string, Linked" name="fn">
      <arg name="test" type="string">Testing</arg>
      <arg name="linked" type="Linked">Linked</arg>
    </fn> 
  </type>
  <type name="Linked" />
</types>
/**/

/* expected */
__<a name="type-test">`Test`</a>__
<table>
 <thead><tr>
  <th>Name</th>
  <th>Type &amp; Description</th>
 </tr></thead>
 <tr>
  <td rowSpan="3" align="center"><strong>nodeName*</strong></td>
  <td><em>(string | <a href="#type-linked">Linked</a>)</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>NodeName</td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><strong>fn*</strong></td>
  <td><em>(test: string, linked: <a href="#type-linked">Linked</a>) => void</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td></td>
 </tr>
</table>


__<a name="type-linked">`Linked`</a>__
/**/

## links args with namespaces
<typedef narrow>test/temp/types.xml</typedef>

/* types */
<types namespace="test">
  <type name="Test">
    <fn name="fn">
      <arg name="linked" type="test.Linked">Linked</arg>
    </fn> 
  </type>
  <type name="Linked" />
</types>
/**/

/* rootNamespace */
test
/**/

/* expected */
__<a name="type-test">`Test`</a>__
<table>
 <thead><tr>
  <th>Name</th>
  <th>Type &amp; Description</th>
 </tr></thead>
 <tr>
  <td rowSpan="3" align="center"><strong>fn*</strong></td>
  <td><em>(linked: <a href="#type-linked">Linked</a>) => void</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td></td>
 </tr>
</table>


__<a name="type-linked">`Linked`</a>__
/**/

## prints `static`
<typedef narrow>test/temp/types.xml</typedef>

/* types */
<types namespace="test">
  <type name="Test">
    <static name="fn" />
  </type>
</types>
/**/

/* rootNamespace */
test
/**/

/* expected */
__<a name="type-test">`Test`</a>__
<table>
 <thead><tr>
  <th>Name</th>
  <th>Type &amp; Description</th>
 </tr></thead>
 <tr>
  <td rowSpan="3" align="center"><kbd>static</kbd> <strong>fn*</strong></td>
  <td><em>() => void</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td></td>
 </tr>
</table>
/**/