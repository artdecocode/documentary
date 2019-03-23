## detects a single use
%USE-MACRO test
<data>hello</data>
<data>world</data>
%

/* matches */
[{"name": "test", "body": "<data>hello</data>\n<data>world</data>"}]
/**/

## detects a multiple uses
%USE-MACRO test
<data>hello</data>
<data>world</data>
%

%USE-MACRO test2
<data>world</data>
<data>hello</data>
%

/* matches */
[{"name": "test", "body": "<data>hello</data>\n<data>world</data>"},
 {"name": "test2", "body": "<data>world</data>\n<data>hello</data>"}]
/**/