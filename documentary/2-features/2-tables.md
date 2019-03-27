## **Simple Tables**

One of the most common problem with markdown is that it is hard to write tables. They must be written either as html, or as markdown, which is troublesome and requires effort. Although there are online tools to build markdown tables, with _Documentary_ the process is even simpler: the data just needs to be put into a JSON array.

To describe tabular data (for example, a CLI tool arguments) in a table, but prepare them in a more readable format, _Documentary_ allows to write code blocks with the `table` language to be converted into a markdown table. The content of the blocks must be in `JSON` format and contain a single array of arrays which represent rows.

````m
```table
[
  ["arg", "description"],
  ["-f", "Display only free domains"],
  ["-z", "A list of zones to check"],
]
```
````

Result:

| arg | description |
| --- | ----------- |
| -f | Display only free domains |
| -z | A list of zones to check |

### Template Macros

Whenever there's a pattern for presenting data in a table, such as that input fields can be mapped to output columns, a table macro can be defined. The example below defines a macro to print a row containing a link, logo and description of a company. It is then used in a table, where only the actual values are entered, relying on _Documentary_ to substitute them in the template.

%EXAMPLE: test/result/bin/macro.md, markdown%

%FORK-markdown src/bin/doc test/result/bin/macro.md%

The values in the macro need to be separated with `,` which allows to substitute them into the correct column of the table row. When a `,` needs to be used as part of the column in the macro, it can be escaped with `\` such as `\,` as shown in the last column of the example.

| Company | Tag Line | Evaluation & Exit |
| ------- | -------- | ----------------- |
| <a href="https://vwo.com">![VWO Logo](images/logos/vwo.png)</a> | A/B Testing and Conversion Optimization Platform™ | $10m, 2018 |

%~%