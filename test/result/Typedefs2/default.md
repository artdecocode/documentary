## does not add default column when there are no defaults
<types>
  <type name="test">
    <prop opt name="prop">TestProp</prop>
    <prop name="prop">TestProp2</prop>
  </type>
</types>

/* expected */
__[`test`](t-type)__

```table
[
  [
    "Name",
    "Type",
    "Description"
  ],
  [
    "prop",
    "<em>*</em>",
    "TestProp"
  ],
  [
    "__prop*__",
    "<em>*</em>",
    "TestProp2"
  ]
]
```
/**/

## can link piped types
<types>
  <type name="Type" />
  <type name="Type2">
    <prop name="prop" type="string|Type">
      A property.
    </prop>
  </type>
</types>

/* expected */
__[`Type`](t-type)__
__[`Type2`](t-type)__

```table
[
  [
    "Name",
    "Type",
    "Description"
  ],
  [
    "__prop*__",
    "<em>(string \\| [Type](#type-type))</em>",
    "A property."
  ]
]
```
/**/

## can link promised types
<types>
  <type name="Type" />
  <type name="Type2" />
  <type name="Type3" />
  <type name="Type4" />
  <type name="Type5">
    <prop name="prop" type="Promise.<Type|Type2>|Type3|Type4">
      A property.
    </prop>
  </type>
</types>

/* expected */
__[`Type`](t-type)__
__[`Type2`](t-type)__
__[`Type3`](t-type)__
__[`Type4`](t-type)__
__[`Type5`](t-type)__

```table
[
  [
    "Name",
    "Type",
    "Description"
  ],
  [
    "__prop*__",
    "<em>(Promise&lt;([Type](#type-type) \\| [Type2](#type-type2))&gt; \\| [Type3](#type-type3) \\| [Type4](#type-type4))</em>",
    "A property."
  ]
]
```
/**/

## can link the import to a website
<types>
  <import
    name="Test"
    from="vm"
    link="https://nodejs.org/api/vm.html#Test"
  />
</types>

/* expected */
[`import('vm').Test`](https://nodejs.org/api/vm.html#Test) __[`vm.Test`](l-type)__
/**/

## can insert example - WIP
<types>
  <type name="Return">
    <prop name="body" type="string|object|Buffer">
      The return from the server.
    </prop>
    <prop name="statusMessage" type="string">
      The status message set by the server.
      <e>OK</e>
    </prop>
  </type>
</types>

/* expected */
__[`Return`](t-type)__

```table
[
  [
    "Name",
    "Type",
    "Description"
  ],
  [
    "__body*__",
    "<em>(string \\| object \\| Buffer)</em>",
    "The return from the server."
  ],
  [
    "__statusMessage*__",
    "<em>string</em>",
    "The status message set by the server.\n      &lt;e&gt;OK&lt;/e>"
  ]
]
```
/**/