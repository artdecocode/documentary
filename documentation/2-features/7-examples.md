### Examples Injection

`documentary` can be used to embed examples into the documentation. The example file needs to be specified with the following marker:

```
%EXAMPLE: examples/example.js, ../src => documentary%
```

The first argument is the path to the example relative to the working directory of where the command was executed (normally, the project folder). The second optional argument is the replacement for the `require` and `import` statements. The third optional argument is the markdown language to embed the example in and will be determined from the example extension if not specified.
