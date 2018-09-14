## **Embedding Output**

When placing examples, it is important to show the output that they produce. This can be achieved using the `FORK` marker.

```md
%FORK(-lang)? module ...args%
```

It will make _Documentary_ fork a Node.js module using the `child_process.fork` function. The output is printed in a code block, with optionally given language.

<table>
<thead>
 <tr>
  <th>Markdown</th><th>JavaScript</th>
 </tr>
</thead>
<tbody>
 <tr/>
 <tr>
  <td>

%EXAMPLE: example/fork/fork.md, markdown%
  </td>

  <td>

%EXAMPLE: example/fork/fork.js%
  </td>
 </tr>
 <tr>
 <td colspan="2" align="center"><strong>Output<strong></td>
 </tr>
 <tr>
 <td colspan="2">

%FORK src/bin/alamode example/fork/fork.md%
 </td>
 </tr>
</table>

<!-- %FORK example example/fork% -->

### Stderr

By default, the `FORK` marker will print the `stdout` output. To print the `stderr` output, there is the `FORKERR` marker.

```md
%FORKERR(-lang)? module ...args%
```

It works exactly the same as `%FORK%` but will print the output of the process's `stderr` stream.


<table>
<thead>
 <tr>
  <th>Markdown</th><th>JavaScript</th>
 </tr>
</thead>
<tbody>
 <tr/>
 <tr>
  <td>

%EXAMPLE: example/fork/fork-stderr.md, markdown%
  </td>

  <td>

%EXAMPLE: example/fork/fork-stderr.js%
  </td>
 </tr>
 <tr>
 <td colspan="2" align="center"><strong>Output<strong></td>
 </tr>
 <tr>
 <td colspan="2">

%FORK src/bin/alamode example/fork/fork-stderr.md%
 </td>
 </tr>
</table>