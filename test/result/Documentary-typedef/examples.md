## indents the example properly
<typedef narrow slimFunctions>test/temp/types.xml</typedef>

/* types */
<types>
  <interface name="Test">
    <fn void name="set">
      Set header `field` to `val`, or pass an object of header fields.

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
  <td><em>() => void</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Set header <code>field</code> to <code>val</code>, or pass an object of header fields.

```js
this.set('Foo', ['bar', 'baz'])
  this.set('Accept', 'application/json')
this.set({ Accept: 'text/plain', 'X-API-Key': 'tobi' })
```
  </td>
 </tr>
</table>
/**/

## examples in properties
<typedef narrow>test/temp/types.xml</typedef>

/* types */
<types>
  <interface name="Test">
    <prop string name="test" example="test/fixture/example/prop.js">
      The prop.
    </prop>
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
  <td rowSpan="3" align="center"><ins>test</ins></td>
  <td><em>string</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>

The prop.
```js
ctx.response.etag = 'md5hashsum'
ctx.response.etag = '"md5hashsum"'
ctx.response.etag = 'W/"123456789"'
```
  </td>
 </tr>
</table>
/**/