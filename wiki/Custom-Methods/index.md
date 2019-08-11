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

