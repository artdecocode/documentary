## **Method Titles**

_Documentary_ can generate neat titles useful for API documentation. The method signature should be specified in a `JSON` array, where every member is an argument written as an array containing its name and type. The type can be either a string, or an object.

For object types, each value is an array which contains the property type and its default value. To mark a property as optional, the `?` symbol can be used at the end of the key.

The last item in the argument array is used when the argument is an object and is a short name to be place in the table of contents (so that a complex object can be referenced to its type).

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

Generated from

````m
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

```### async runSoftware
[
  ["path", "string"]
]
```

Generated from

````m
```### async runSoftware
[
  ["path", "string"]
]
```
````

```### runSoftware => string
```

Generated from

````m
```### runSoftware => string
```
````


```### runSoftware
```

Generated from

````m
```### runSoftware
```
````

%~%