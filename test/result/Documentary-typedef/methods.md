## creates typedef for methods
<typedef level="3">test/fixture/typedef/methods.xml</typedef>

/* expected */
### <code><ins>h</ins>(</code><sub><br/>&nbsp;&nbsp;`nodeName: string|!Function,`<br/>&nbsp;&nbsp;`attributes=: Object,`<br/>&nbsp;&nbsp;`...args: !(preact.VNode|Array<!preact.VNode>),`<br/><code>): <i>!preact.VNode</i></code></sub>
The pragma (rendering) function.

 - <kbd><strong>nodeName*</strong></kbd> <em><code>(string \| !Function)</code></em>: An element name. Ex: `div`, `a`, `span`, etc.
 - <kbd>attributes</kbd> <em>`Object`</em> (optional): Any attributes/props to set on the created element.
 - <kbd>...args</kbd> <em><code>!(preact.VNode \| Array&lt;!preact.VNode&gt;)</code></em> (optional): Additional arguments are taken to be children to append. Can be infinitely nested Arrays.


### <code><ins>createElement</ins>(</code><sub><br/>&nbsp;&nbsp;`nodeName: string|!Function,`<br/>&nbsp;&nbsp;`attributes=: Object,`<br/>&nbsp;&nbsp;`...args: !(preact.VNode|Array<!preact.VNode>),`<br/><code>): <i>!preact.VNode</i></code></sub>
The pragma (rendering) function. Alias of `h`.

 - <kbd><strong>nodeName*</strong></kbd> <em><code>(string \| !Function)</code></em>: An element name. Ex: `div`, `a`, `span`, etc.
 - <kbd>attributes</kbd> <em>`Object`</em> (optional): Any attributes/props to set on the created element.
 - <kbd>...args</kbd> <em><code>!(preact.VNode \| Array&lt;!preact.VNode&gt;)</code></em> (optional): Additional arguments are taken to be children to append. Can be infinitely nested Arrays.
/**/