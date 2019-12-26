## creates typedef for functions
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
  <td>
   NodeName
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><strong>fn*</strong></td>
  <td><em>(test: string, linked: <a href="#type-linked">Linked</a>) => ?</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   <kbd><strong>test*</strong></kbd> <em><code>string</code></em>: Testing<br/>
   <kbd><strong>linked*</strong></kbd> <em><code><a href="#type-linked">Linked</a></code></em>: Linked
  </td>
 </tr>
</table>


__<a name="type-linked">`Linked`</a>__
/**/

## links args with namespaces
<typedef narrow>test/temp/types.xml</typedef>

/* types */
<types namespace="test">
  <type name="Test">
    <fn name="fn" void>
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
  <td>
   <kbd><strong>linked*</strong></kbd> <em><code><a href="#type-linked">Linked</a></code></em>: Linked
  </td>
 </tr>
</table>


__<a name="type-linked">`Linked`</a>__
/**/

## prints `static`
<typedef narrow>test/temp/types.xml</typedef>

/* types */
<types namespace="test">
  <type name="Test">
    <static name="fn" void />
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
<typedef narrow flatten slimFunctions>test/temp/types.xml</typedef>

/* types */
<types namespace="_typal">
  <interface name="Test">
    <fn name="toMarkdown" void>
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
__<a name="type-test">`Test`</a>__
<table>
 <thead><tr>
  <th>Name</th>
  <th>Type &amp; Description</th>
 </tr></thead>
 <tr>
  <td rowSpan="3" align="center"><ins>constructor</ins></td>
  <td><em>new () => <a href="#type-test">Test</a></em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Constructor method.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>toMarkdown</ins></td>
  <td><em>(allTypes: !Array&lt;!Type&gt;, opts: <a href="#type-tomarkdownoptions">!ToMarkdownOptions</a>) => void</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Converts a type to a markdown string.
  </td>
 </tr>
</table>


__<a name="type-tomarkdownoptions">`ToMarkdownOptions`</a>__
/**/

## keeps _ in args
<typedef narrow slimFunctions>test/temp/types.xml</typedef>

/* types */
<types>
  <interface name="Test">
    <fn name="toMarkdown" void>
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
  <td rowSpan="3" align="center"><ins>constructor</ins></td>
  <td><em>new () => <a href="#type-test">Test</a></em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Constructor method.
  </td>
 </tr>
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

## displays application return
<typedef narrow slimFunctions>test/temp/types.xml</typedef>

/* types */
<types>
  <interface name="Test">
    <fn async name="toMarkdown" return="!Array<{ record: string }>" />
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
  <td rowSpan="3" align="center"><ins>constructor</ins></td>
  <td><em>new () => <a href="#type-test">Test</a></em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Constructor method.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>toMarkdown</ins></td>
  <td><em>() => !Promise&lt;!Array&lt;{ record: string }&gt;&gt;</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td></td>
 </tr>
</table>
/**/

## displays optional argument from args correctly
<typedef narrow flatten>test/temp/types.xml</typedef>

/* types */
<types>
  <interface name="Test">
    <fn args="optional=" name="fn" return="?" />
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
  <td rowSpan="3" align="center"><ins>constructor</ins></td>
  <td><em>new () => <a href="#type-test">Test</a></em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Constructor method.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>fn</ins></td>
  <td><em>(arg0?: optional) => ?</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td></td>
 </tr>
</table>
/**/

## displays variable and this args
<typedef narrow slimFunctions>test/temp/types.xml</typedef>

/* types */
<types>
  <interface name="Test">
    <prop opt type="function(this:Type, ...Type)" name="prop" />
    <fn name="fn" void>
      <arg name="this" type="Type">
        The context.
      </arg>
      <arg name="...args" type="Type">
        Additional arguments.
      </arg>
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
  <td rowSpan="3" align="center"><ins>constructor</ins></td>
  <td><em>new () => <a href="#type-test">Test</a></em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Constructor method.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>prop</ins></td>
  <td><em>(this: Type, ...args: Type[]) => ?</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td></td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>fn</ins></td>
  <td><em>(this: Type, ...args: Type[]) => void</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td></td>
 </tr>
</table>
/**/

## adds newline after ```
<typedef narrow>test/temp/types.xml</typedef>

/* types */
<types>
  <interface name="Test">
    <fn void name="set">
      <arg type="string|!Object" name="field">
        The field to set, or an object of header fields.
      </arg>
      <arg type="string|!Array|number" name="val" opt>
        The value to set, when passing a single field.
      </arg>
      Set header `field` to `val`, or pass an object of header fields.

      _Examples_:

      ```js
      this.set('Foo', ['bar', 'baz'])
      this.set('Accept', 'application/json')
      this.set({ Accept: 'text/plain', 'X-API-Key': 'tobi' })
      ```
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
  <td rowSpan="3" align="center"><ins>constructor</ins></td>
  <td><em>new () => <a href="#type-test">Test</a></em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Constructor method.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>set</ins></td>
  <td><em>(field: (string | !Object), val?: (string | !Array | number)) => void</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>

Set header `field` to `val`, or pass an object of header fields.

_Examples_:

```js
this.set('Foo', ['bar', 'baz'])
this.set('Accept', 'application/json')
this.set({ Accept: 'text/plain', 'X-API-Key': 'tobi' })
```
<br/>
<kbd><strong>field*</strong></kbd> <em><code>(string \| !Object)</code></em>: The field to set, or an object of header fields.<br/>
<kbd>val</kbd> <em><code>(string \| !Array \| number)</code></em> (optional): The value to set, when passing a single field.
  </td>
 </tr>
</table>
/**/

## correct links with an array
<typedef flatten narrow slimFunctions>test/temp/types.xml</typedef>

/* types */
<types>
  <import from="http" name="Server" />
  <interface name="Test">
    <fn name="listen" return="!http.Server" template-no-return>
      <arg name="...args">The arguments as [described](https://nodejs.org/api/net.html#net_server_listen).</arg>
      Shorthand for: `http.createServer(app.callback()).listen(...)`.
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
  <td rowSpan="3" align="center"><ins>constructor</ins></td>
  <td><em>new () => <a href="#type-test">Test</a></em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Constructor method.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>listen</ins></td>
  <td><em>(...args: *[]) => <a href="https://nodejs.org/api/http.html#http_class_http_server" title="An HTTP server that extends net.Server to handle network requests."><img src=".documentary/type-icons/node-even.png" alt="Node.JS Docs">!http.Server</a></em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Shorthand for: <code>http.createServer(app.callback()).listen(...)</code>.
  </td>
 </tr>
</table>
/**/


## adds links
<typedef narrow slimFunctions>test/fixture/typedef/fns.xml</typedef>
<link type="preact.H">LINK</link>

/* expected */
__<a name="type-preacth">`preact.H`</a>__: Hello world.
<table>
 <thead><tr>
  <th>Name</th>
  <th>Type &amp; Description</th>
 </tr></thead>
 <tr>
  <td rowSpan="3" align="center"><ins>constructor</ins></td>
  <td><em>new (nodeName: (string | !Function), attributes?: Object, ...args: !(preact.VNode | Array&lt;!preact.VNode&gt;)[]) => <a href="#type-preacth" title="Hello world.">preact.H</a></em></td>
 </tr>
 <tr></tr>
 <tr>
  <td></td>
 </tr>
</table>
<a href="#type-preacth" title="Hello world.">LINK</a>
/**/

## levels
1. In the body of a method:
    <typedef level="4" narrow details="Location">test/fixture/typedef/method.xml</typedef>

/* expected */
1. In the body of a method:
    #### <code>async <ins>workHard</ins>(</code><sub><br/>&nbsp;&nbsp;`hours: number,`<br/>&nbsp;&nbsp;`location: wiki.Location,`<br/></sub><code>): <i>void</i></code>
    Spawns a worker process.
    
     - <kbd><strong>hours*</strong></kbd> <em>`number`</em>: How long to work for.
     - <kbd><strong>location*</strong></kbd> <em><code>[wiki.Location](#type-wikilocation)</code></em>: Where to work.
    
    
    <details>
     <summary><strong><a name="type-wikilocation"><code>wiki.Location</code></a></strong></summary>
    <table>
     <thead><tr>
      <th>Name</th>
      <th>Type &amp; Description</th>
     </tr></thead>
     <tr>
      <td rowSpan="3" align="center"><strong>lat*</strong></td>
      <td><em>number</em></td>
     </tr>
     <tr></tr>
     <tr>
      <td></td>
     </tr>
     <tr>
      <td rowSpan="3" align="center"><strong>long*</strong></td>
      <td><em>number</em></td>
     </tr>
     <tr></tr>
     <tr>
      <td></td>
     </tr>
    </table>
    </details>
/**/