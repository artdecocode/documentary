Custom method titles can be implemented by providing a `method` JSX component. The component can be placed in the project's directory e.g.,

- `package/.documentary/index.jsx`, or
- `package/.documentary.jsx`

The JSX file read by documentary must export the **named** `method` export:
<!--  -->
<table>
<tr/>
<tr><td>

%EXAMPLE: wiki/Custom-Methods/.documentary, js%
</td></tr>
</table>

The component itself, like other [[Documentary Components|JSX Components]] can return a string, a JSX element, or an array of those.

## On This Page

%TOC%

%~%

## Method Title Rule

The [[method title rule|Method Titles]] allows to define a method in Markdown using JSON notation using an array of arguments and their types, for example:

````json
```### async runSoftware => string
[
  ["path", "string"],
  ["config", {
    "View": ["Container"],
    "actions": ["object"],
    "static=": ["boolean", true],
    "render=": ["function"]
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

However, it is understandable that developers would want to implement their own designs of method titles, yet use the simplicity and standardisation of notation to their advantage.

In a more [[advanced use case|typal-methods]], methods are defined in a separate file, and can also be embedded into documentation. This page shows how to render the headings of methods and their titles, regardless of where the information about the method comes from.

%~%

## Method Interface

A method is a special case of a _Typal's_ type and includes the following properties that can be used when rendering the title:

- <kbd>name</kbd>: The name of the method.
- <kbd>async</kbd>: Whether the method is async.
- <kbd>return</kbd>: The return type.
- <kbd>args</kbd>: And the array of arguments.

Each argument is a record of the following type:

- <kbd>name</kbd>: The name of the argument.
- <kbd>type</kbd>: The argument's type. Either a string, or an object as discussed on the [[Method Titles]] page.
- <kbd>optional</kbd>: Whether the argument is optional. This is deduced from arguments' name ending with the `=` symbol.
- <kbd>shortType</kbd>: When an argument is defined as an object as in the example above, this can be used as a shorted title, for example for the table of contents.


<table>
<tr><td>
<md2html>
When the correct JSDoc specifying `import('typal/types').Method` as the `method` param is written for the custom component, all this information will be available in the IDE (_VSCode_):
</md2html>
</td></tr>
<tr><td>

[[desc.png|alt=VSCode autocompletion hints]]
<!-- /block-end -->
</table>

Finally, the component will receive the `level` property indicating the level at which the heading should be placed.

Therefore, by following the custom implementation provided at the top of the page, the following result will be achieved:

<fork lang="md" env="DOCUMENTARY_CWD=wiki/Custom-Methods DOCUMENTARY_IGNORE_HIDDEN=false">src/bin/doc wiki/Custom-Methods/.markdown.md</fork>

<details><summary>Show Source</summary>

%EXAMPLE: wiki/Custom-Methods/.markdown.md%
</details>

%~%

## TOC

After the method title is placed, another pass will generate tables of contents at the end by looking for `#{...}` and `<h{1-6}>` headings. To supply a custom link for the table of contents, it's possible to call the `documentary.addDToc` method:

%EXAMPLE: wiki/Custom-Methods/custom/.documentary, js%

There are two possibilities to use the `addDToc` method: either to use _Documentary_'s engine to render the heading for the link, using information about the method, or to give the string that should appear in TOC. When giving a string, 3 options are expected:

- <kbd>string</kbd>: The string to display in TOC.
- <kbd>replacedTitle</kbd>: The title that will serve as heading. It will be used to generate a link in the same format that [_GitHub_ uses](https://github.com/jch/html-pipeline/blob/master/lib/html/pipeline/toc_filter.rb), so that's basically the return of the component.
- <kbd>level</kbd>: Controls the level of TOC where to place the link.

The updated generated documentation looks the following:

<fork lang="md" env="DOCUMENTARY_CWD=wiki/Custom-Methods/custom DOCUMENTARY_IGNORE_HIDDEN=false">src/bin/doc wiki/Custom-Methods/.markdown.md</fork>

Notice how this time, because the `string` was passed with the title without arguments, they don't appear in the table of contents, yet are present in the heading and participate in the formation of the link.

%~%

## Debugging

To debug a method title, the following configuration can be created for _VS Code_:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Launch Doc",
  "program": "${workspaceFolder}/node_modules/.bin/doc",
  "env": { "NODE_DEBUG": "doc" },
  "skipFiles": [
    "<node_internals>/**/*.js"
  ]
}
```

Then either a breakpoint should be set in the component's file, or the `debugger` statement added somewhere in the code. Without any arguments, _Documentary_ will read the `documentary` source directory and produce output to _STDOUT_. No JSX setup is required since _Documentary_ uses _ÀLaMode_ internally for transpilation.