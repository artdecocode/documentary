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

## prints type of argument in prop-function
<typedef narrow>test/temp/types.xml</typedef>

/* types */
<types namespace="test">
  <type name="Test">
    <prop type="function(string): string" name="preprocessDesc" opt />
  </type>
</types>
/**/

/* expected */
__<a name="type-testtest">`test.Test`</a>__
<table>
 <thead><tr>
  <th>Name</th>
  <th>Type &amp; Description</th>
 </tr></thead>
 <tr>
  <td rowSpan="3" align="center">preprocessDesc</td>
  <td><em>(arg0: string) => string</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td></td>
 </tr>
</table>
/**/

## links args with namespaces in interfaces
<typedef narrow flatten>test/temp/types.xml</typedef>

/* types */
<types namespace="_typal">
  <interface name="Test">
    <fn name="toMarkdown">
      <arg name="allTypes" type="!Array<!_typal.Type>">
        The array with all types for linking.
      </arg>
      <arg name="opts" type="!_typal.ToMarkdownOptions">
        Options passed by _Documentary_.
      </arg>
      Converts a type to a markdown string.
    </fn>
  </interface>
  <type record name="ToMarkdownOptions" />
</types>
/**/

/* rootNamespace */
_typal
/**/

/* expected */
__<a name="type-tomarkdownoptions">`ToMarkdownOptions`</a>__


__<a name="type-test">`Test`</a>__
<table>
 <thead><tr>
  <th>Name</th>
  <th>Type &amp; Description</th>
 </tr></thead>
 <tr>
  <td rowSpan="3" align="center"><ins>toMarkdown</ins></td>
  <td><em>(allTypes: !Array&lt;!Type&gt;, opts: <a href="#type-tomarkdownoptions">!ToMarkdownOptions</a>) => void</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>Converts a type to a markdown string.</td>
 </tr>
</table>
/**/

## keeps _ in args
<typedef narrow flatten>test/temp/types.xml</typedef>

/* types */
<types>
  <interface name="Test">
    <fn name="toMarkdown">
      <arg name="allTypes" type="!Array<!_typal.Type>">a</arg>
      <arg name="opts" type="!_typal.ToMarkdownOptions">b</arg>
    </fn>
  </interface>
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
  <td rowSpan="3" align="center"><ins>toMarkdown</ins></td>
  <td><em>(allTypes: !Array&lt;!_typal.Type&gt;, opts: !_typal.ToMarkdownOptions) => void</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td></td>
 </tr>
</table>
/**/