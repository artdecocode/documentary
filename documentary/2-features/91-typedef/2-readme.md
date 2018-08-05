
#### README placement

To place a type definition as a table into a `README` file, the `TYPEDEF` snippet can be used, where the first argument is the path to the `xml` file containing definitions, and the second one is the name of the type to embed. Moreover, links to the type descriptions will be created in the table of contents using the [__TOC Titles__](#toc-titles), but to prevent this, the `noToc` attribute should be set for a type.

```
%TYPEDEF path/definitions.xml TypeName%
```

For example, using previously defined `StaticConfig` type from `types/static.xml` file, `documentary` will process the following markers:

```
%TYPEDEF types/static.xml ServerResponse%
%TYPEDEF types/static.xml SetHeaders%
%TYPEDEF types/static.xml StaticConfig%
```

or a single marker to include all types in order in which they appear in the `xml` file (doing this also allows to reference other types from properties):

```
%TYPEDEF types/static.xml%
```

and embed resulting type definitions:

%TYPEDEF types/static.xml%
