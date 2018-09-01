### Examples Placement

`documentary` can be used to embed examples into the documentation. The example file needs to be specified with the following marker:

```
%EXAMPLE: example/example.js [, ../src => documentary] [, javascript]%
```

The first argument is the path to the example relative to the working directory of where the command was executed (normally, the project folder). The second optional argument is the replacement for the `import` statements. The third optional argument is the markdown language to embed the example in and will be determined from the example extension if not specified.

Given the documentation section:

%EXAMPLE: example/examples.md%

And the example file `examples/example.js`

%EXAMPLE: example/example.js%

The program will produce the following output:

%FORK-md src/bin/alamode example/examples.md%
