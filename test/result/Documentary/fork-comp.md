## calls a fork with answers
<fork lang="js">
  <answer regex="Are you sure">yes</answer>
  <answer regex="Please confirm">no</answer>
  <answer stderr regex="STDERR">documentary 123</answer>
  test/fixture/fork-comp.js
</fork>

/* expected */
```js
Are you sure? yes
Please confirm: no
{ a: 'yes', b: 'no' }
documentary 123
```
/**/

## adds indicatrix
<fork>test/fixture/fork/indicatrix-placeholder</fork>

/* expected */
<pre>forking
<a id="_ind0" href="#_ind0"><img src=".documentary/indicatrix.gif"></a>
</pre>
/**/