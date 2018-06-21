### Method Title

It is possible to generate neat titles useful for API documentation with `documentary`. The method signature should be specified as a `JSON` array, where every member is an argument specified as an array. The first item in the argument array is the argument name, and the second one is type. Type can be either a string, or an object. If it is an object, each value in the object will first contain the property type, and the second one the default value. To mark a property as optional, the `?` symbol can be used at the end.

```#### async runSoftware => string
[
  ["path", "string"],
  ["config", {
    "View": ["Container"],
    "actions": ["object"],
    "static?": ["boolean", true],
    "render?": ["function"]
  }]
]
```

Generated from

````m
```#### async runSoftware => string
[
  ["path", "string"],
  ["config", {
    "View": ["Container"],
    "actions": ["object"],
    "static?": ["boolean", true],
    "render?": ["function"]
  }]
]
```
````

```#### async runSoftware
[
  ["path", "string"]
]
```

Generated from

````m
```#### async runSoftware
[
  ["path", "string"]
]
```
````

```#### runSoftware => string
```

Generated from

````m
```#### runSoftware => string
```
````
