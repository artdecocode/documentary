Custom method titles can be implemented by providing a `method` component. The component can be placed in the project's directory, e.g.,

- `.documentary/index.jsx`, or
- `.documentary.jsx`

And export the named `method` export:
<!--  -->
%EXAMPLE: wiki/Custom-Methods/method.jsx, js%

## On This Page

%TOC%

%~%

## Method Title Rule

The [[method title rule|Method Titles]] allows to define a method in Markdown using JSON notation using an array of arguments and their types, for example:

````
```### async runSoftware => string
[
  ["path", "string"],
  ["config", {
    "View": ["Container"],
    "actions": ["object"],
    "static?": ["boolean", true],
    "render?": ["function"]
  }, "Config"]
]
```
````

The method title above would be rendered in the following way:

```### async runSoftware => string
[
  ["path", "string"],
  ["config", {
    "View": ["Container"],
    "actions": ["object"],
    "static?": ["boolean", true],
    "render?": ["function"]
  }, "Config"]
]
```

However, it is understandable that developers would want to implement their own designs of method titles, yet use the simplicity of notation to their advantage. In more [advanced used case](#typal-methods), the methods are defined in a separate file, and can also be embedded into documentation.

%~%

## Typal Methods

With _Typal_, a package that allows to keep types in a separate file, methods are defined using XML schema. This not only allows to embed them into documentation, but also into the source code using the template feature. This is needed when packages are compiled using _Closure Compiler_, and the _JSDoc_ annotations are lost after compilation. Using the templates and information about methods, it becomes possible to restore editor run-time JSDoc for package consumers.

_For example, a method can be defined in the following way:_

%EXAMPLE: wiki/Custom-Methods/api.xml%

_And it can be placed into the source code:_

<typedef narrow>wiki/Custom-Methods/api1.xml</typedef>

%~%