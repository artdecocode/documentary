### README placement

To place a type definition as a table into a `README` file, the `TYPEDEF` marker can be used, where the first argument is the path to the `xml` file containing definitions, and the second one is the name of the type to embed. Moreover, links to the type descriptions will be created in the table of contents using the [__TOC Titles__](#toc-titles), but to prevent this, the `noToc` attribute should be set for a type.

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

and embed resulting type definitions (with the imported type linked to the Node.js documentation due to its `link` attribute):

%TYPEDEF types/static.xml%

_Documentary_ wil scan each source file of the documentation first to build a map of all types. Whenever a property appears to be of a known type, it will be automatically linked to the location where it was defined. It is also true for properties described as generic types, such as `Promise.<Type>`. This makes it possible to define all types in one place, and then reference them in the API documentation.