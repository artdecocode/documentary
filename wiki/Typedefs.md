[_Typal_](https://artdecocode.com/typal/) is a package to manage JSDoc typedefs from a separate `types.xml` file (or files). They can then be placed into JavaScript, used to generate _Google Closure Compiler_ externs and embedded into documentation with _Documentary_. When placed in JS, one of the advantages is that it allows to expand function parameters' properties, so that they are better visible from the IDE:

[[typedef-config.gif|alt=Preview Of The Configure Function]]

The main use of _Typal_ is together with _Documentary_ to insert tables with types' descriptions.

## On This Page

%TOC%

%~%

## README placement

To place a type definition as a table into a `README` file, the `TYPEDEF` marker can be used, where the first argument is the path to the `xml` file containing definitions, and the second one is the name of the type to embed. Moreover, links to the type descriptions will be created in the table of contents using the [[TOC Titles|Tables-Of-Contents#toc-titles]], but to prevent this, the `noToc` attribute should be set for a type.

<details>
<summary>Show Types.Xml</summary>

%EXAMPLE: types/static.xml%
</details>

```
%TYPEDEF path/definitions.xml [TypeName]%
```

For example, using the previously defined `StaticConfig` type from `types/static.xml` file, _Documentary_ will process the following markers:

```
%TYPEDEF types/static.xml ServerResponse%
%TYPEDEF types/static.xml SetHeaders%
%TYPEDEF types/static.xml StaticConfig%
```

or a single marker to include all types in order in which they appear in the `xml` file:

```
%TYPEDEF types/static.xml%
```

and embed resulting type definitions (with the imported type linked to the _Node.JS_ documentation due to its `link` attribute):

%TYPEDEF types/static.xml%

_Documentary_ wil scan each source file of the documentation first to build a map of all types. Whenever a property appears to be of a known type, it will be automatically linked to the location where it was defined. It is also true for properties described as generic types, such as `Promise<Type>`. This makes it possible to define all types in one place, and then reference them in the API documentation. For the full list of supported types for linking, see [_Typal_'s documentation](https://github.com/artdecocode/typal/#markdown-documentation).

[Read More](../blob/master/doc/typal.md) about types in _Documentary_ including advanced usage with the spread option.