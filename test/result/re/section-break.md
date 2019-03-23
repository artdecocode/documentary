## detects a single section brake
%~%

/* matches */
[{}]
/**/

## detects multiple section brakes
%~%

%~%

/* matches */
[{}, {}]
/**/

## detects a section brake with a number
%~ 25%

/* matches */
[{ "number": "25" }]
/**/

## detects a section brake with attributes
%~ href="https://github.com"%

/* matches */
[{ "attrs": "href=\"https://github.com\"" }]
/**/

## detects a section brake with a number and attributes
%~ 25 href="https://github.com"%

/* matches */
[{ "number": "25", "attrs": "href=\"https://github.com\"" }]
/**/