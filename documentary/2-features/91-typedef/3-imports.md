
#### Importing Types

A special `import` element can be used to import a type using _VS Code_'s _TypeScript_ engine. An import is just a typedef which looks like `/** @typedef {import('package').Type} Type */`. This makes it easier to reference the external type later in the file. However, it is not supported in older versions of _VS Code_.

<table>
<thead>
<tr>
<th>Original Source</th>
<th>Types Definition</th>
</tr>
</thead>
<tbody>
<tr/>
<tr><td>

%EXAMPLE: example/generate-imports.js, ../src => src, js%
</td>
<td>

%EXAMPLE: types/import.xml%
</td>
</tr>
<tr>
<td colspan="2" align="center">
<strong>Output</strong>
</td></tr>
<tr>
<td colspan="2">

%FORK-js src/bin/alamode example/generate-imports.js -g -%
</td>
</tr>
</tbody>
</table>
