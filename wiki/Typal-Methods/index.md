With _Typal_, a package that facilitates management of types in external files, methods are defined using XML schema. _Documentary_ works together with _Typal_ to embed the descriptions of methods into the documentation.

## On This Page

%TOC%

%~%

## `<typedef>` Component For README

Keeping types in a separate file not only allows to embed them into documentation, but also into the source code using _Typal's_ **template** feature. This is needed when packages are compiled using _Closure Compiler_, and the _JSDoc_ annotations are lost after compilation. Using the templates and information about methods, it becomes possible to restore editor run-time JSDoc for package consumers.

_For example, a method can be defined in the following way:_

%EXAMPLE: wiki/Typal-Methods/api.xml%

_And it can be placed into the source code using the `<typedef>` component:_

```xml
<typedef narrow level="3">wiki/Typal-Methods/api.xml</typedef>
```

The types found inside of the XML file(s) will be linked across the full compiled documentation, either a single README file, or multiple Wiki pages.

<table><tr><th>Example Of Method Embed</th></tr>
<tr><td>

<typedef noArgTypesInToc narrow level="3">wiki/Typal-Methods/api.xml</typedef>

</tr></td></table>

%~ width="25"%

### Flags

There are some properties that can be passed to the `typedef` component:

- <kbd>noArgTypesInToc</kbd>: Don't print types of arguments in the table of contents.
- <kbd>slimFunctions</kbd>: Don't print arguments' description and types in the types' tables.

%~%

## Source Code

The same type can be placed into the source code by creating a [template](wiki/Typal-Methods/template.js).

<table>
<!-- block-start -->
<tr><td><md2html>
The template uses the `@methodType` marker to indicate the type of the method.

</md2html></td></tr>
<tr><td>

%EXAMPLE: wiki/Typal-Methods/template.js%
</td></tr>
<!-- /block-end -->
<!-- block-start -->
<tr><td><md2html>
_Typal_ then parses the types file, and updates the template to place annotations into the compiled file.
Command used: `typal template.js -T output.js -t api.xml`.
</md2html>
</td></tr>
<tr><td>

%FORK-js node_modules/.bin/typal wiki/Typal-Methods/template.js -T - -t wiki/Typal-Methods/api.xml%
</td></tr>
<!-- /block-end -->
</table>

%~%

## Designs

To provide custom designs of headings for methods, follow [[this guide|Custom-Methods]].

> TODO: implement custom designs of descriptions and tables.