## replaces self-closing components
<Component/>

/* expected */
<div class="test">Hello World</div>
/**/

## replaces components
<Component></Component>

/* expected */
<div class="test">Hello World</div>
/**/

## replaces components with new line in attributes
<Component test
  boolean />
  <Component test
  boolean></Component>

/* expected */
<div class="test">Hello World</div>
  <div class="test">Hello World</div>
/**/