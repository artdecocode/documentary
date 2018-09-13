## Replacement Rules

There are some other built-in rules for replacements which are listed in this table.

%TABLE-MACRO rule
  [`$1`](t), %2
%

```table
[
  ["Rule", "Description"],
  [
    "%NPM: package-name%",
    "Adds an NPM badge, e.g., `[![npm version] (https://badge.fury.io/js/documentary.svg)] (https://npmjs.org/package/documentary)`"
  ],
  [
    "%TREE directory ...args%",
    "Executes the `tree` command with given arguments. If `tree` is not installed, warns and does not replace the match."
  ],
  [
    "%FORK(-lang)? module ...args%",
    "Forks the Node.js process to execute the module using `child_process.fork`. The output is printed in the code block, with optionally given language. For example: `%FORK-json example.js -o%`"
  ],
  [
    "%FORKERR(-lang)? module ...args%",
    "Same as `%FORK%` but will print the output of the `stderr`."
  ]
]
```
