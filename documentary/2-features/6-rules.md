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
  ]
]
```
