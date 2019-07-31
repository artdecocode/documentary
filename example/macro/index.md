<!-- Define a macro -->
%MACRO example
<details>
<summary>$1</summary>

NPM: _[$1](https://nodejs.tools/$2)_
GitHub: _[$1](https://github.com/artdecocode/$2)_
</details>
%

<!-- Now use the macro! -->
%USE-MACRO example
<data>Documentary</data>
<data>documentary</data>
%

%USE-MACRO example
<data>Zoroaster</data>
<data>zoroaster</data>
%