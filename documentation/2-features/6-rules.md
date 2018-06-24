### Replacement Rules

There are some built-in rules for replacements.

```table
[
  ["Rule", "Description"],
  ["[`%NPM: package-name%`](t)", "Adds an NPM badge, e.g., `[![npm version] (https://badge.fury.io/js/documentary.svg)] (https://npmjs.org/package/documentary)`"],
  ["[`%TREE directory ...args%`](t)", "Executes the `tree` command with the given arguments. If `tree` is not installed, warns and does not replace the match."],
  ["[`%FORK(-lang)? module ...args%`](t)", "Forks the Node.js process to execute the module using `child_process.fork`. The output is printed in the code block, with optionally given language. For example: `%FORK-json example.js -o%`"]
]
```

#### Gif Detail

```
%GIF path/to/file.gif
Alt attribute
Summary of the detail.
%
```

The `GIF` rule will inserts a gif animation inside of a `<detail> block:

%GIF doc/doc.gif
Generating documentation.
<code>yarn doc</code>
%

Which was generated with the following `documentary` block:

```md
%GIF documentation/doc.gif
Generating documentation.
<code>yarn doc</code>
%
```

The actual markdown looks like the one below:

```html
<details>
  <summary><code>yarn doc</code></summary>
  <table>
  <tr><td>
    <img alt="Generating documentation." src="documentation/doc.gif" />
  </td></tr>
  </table>
</details>
```
