### Replacement Rules

There are some built-in rules for replacements.

```table
[
  ["Rule", "Description"],
  ["`%NPM: package-name%`", "Adds an NPM badge, e.g., `[![npm version] (https://badge.fury.io/js/documentary.svg)] (https://npmjs.org/package/documentary)`"],
  ["`%TREE directory ...args%`", "Executes the `tree` command with the given arguments. If `tree` is not installed, warns and does not replace the match."],
  ["[`%FORK(-lang)? module ...args%`](t)", "Forks the Node.js process to execute the module using `child_process.fork`. The output is printed in the code block, with optionally given language. For example: `%FORK-json example.js -o%`"]
]
```
