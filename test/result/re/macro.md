## detects a macro
%MACRO macro
<details open>
<summary><strong>[$1](###)</strong>: $2 <a href="$3">middleware</a>.
<br/><br/>
</summary>

%TYPEDEF types/$4.xml%
</details>
%

/* matches */
[{"p": "%", "name": "macro", "body": "<details open>\n<summary><strong>[$1](###)</strong>: $2 <a href=\"$3\">middleware</a>.\n<br/><br/>\n</summary>\n\n%TYPEDEF types/$4.xml%\n</details>"}]
/**/

## detects multiple macros
%MACRO macro
$1
%

%MACRO macro2
test - $1
%

/* matches */
[{"p": "%", "name": "macro", "body": "$1"},
 {"p": "%", "name": "macro2", "body": "test - $1"}]
/**/

## detects a macro with double %
%%MACRO macro
<details open>
<summary><strong>[$1](###)</strong>: $2 <a href="$3">middleware</a>.
<br/><br/>
</summary>

%TABLE
["hello", "world"]
%
</details>
%%

/* matches */
[{"p": "%%", "name": "macro", "body": "<details open>\n<summary><strong>[$1](###)</strong>: $2 <a href=\"$3\">middleware</a>.\n<br/><br/>\n</summary>\n\n%TABLE\n[\"hello\", \"world\"]\n%\n</details>"}]
/**/