With _Typal_, a package that allows to keep types in a separate file, methods are defined using XML schema. This not only allows to embed them into documentation, but also into the source code using the template feature. This is needed when packages are compiled using _Closure Compiler_, and the _JSDoc_ annotations are lost after compilation. Using the templates and information about methods, it becomes possible to restore editor run-time JSDoc for package consumers.

_For example, a method can be defined in the following way:_

%EXAMPLE: wiki/Typal-Methods/api.xml%

_And it can be placed into the source code using the `<typedef>` component:_

```xml
<typedef narrow level="3">wiki/Typal-Methods/api.xml</typedef>
```

<typedef narrow level="3">wiki/Typal-Methods/api.xml</typedef>

%~%