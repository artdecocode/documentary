// can use a macro
%%MACRO macro
<details open>
<summary><strong>[$1](###)</strong>: $2 <a href="$3">middleware</a>.
<br/><br/>
</summary>

%TYPEDEF types/$4.xml%
</details>
%%

%USE-MACRO macro
<data>session</data>
<data>session handling</data>
<data>https://test.com</data>
<data>index</data>
%

/* expected */

<details open>
<summary><strong><a name="session">session</a></strong>: session handling <a href="https://test.com">middleware</a>.
<br/><br/>
</summary>


</details>
/**/