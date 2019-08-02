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