### Tables Display

To describe method arguments in a table, but prepare them in a more readable format, `documentary` will parse the code blocks with `table` language as a table. The blocks must be in `JSON` format and contain a single array of arrays which represent rows.

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

#### Table Macro

Whenever there's a pattern for presenting data in the table, so that the input fields can be mapped to output ones, a table macro can be defined. The example below defines a macro to print a row containing a link, logo and description of a company. It is then used in a table, where only the actual values are entered, relying `documentary` to place them in the template.

%EXAMPLE: test/mask/bin/macro.md, markdown%

%FORK-markdown src/bin/alamode test/mask/bin/macro.md%

The values in the macro need to be separated with `,` which allows to substitute them into the correct column of the table row. When a `,` needs to be used as part of the column in the macro, it can be escaped with `\` such as `\,` as shown in the last column of the example.

| Company | Tag Line | Evaluation & Exit |
| ------- | -------- | ----------------- |
| <a href="https://vwo.com">![VWO Logo](images/logos/vwo.png)</a> | A/B Testing and Conversion Optimization Platform™ | $10m, 2018 |
