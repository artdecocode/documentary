## creates typedef for methods
<typedef level="3">test/fixture/typedef/methods.xml</typedef>

/* expected */
### `h(`<br/>&nbsp;&nbsp;`nodeName: string|!Function,`<br/>&nbsp;&nbsp;`attributes=: Object,`<br/>&nbsp;&nbsp;`...args: !(preact.VNode|Array<!preact.VNode>),`<br/>`): !preact.VNode`
The pragma (rendering) function.

 - <kbd><strong>nodeName*</strong></kbd> <em>(string \| !Function)</em> : An element name. Ex: `div`, `a`, `span`, etc.
 - <kbd>attributes</kbd> <em>Object</em> (optional): Any attributes/props to set on the created element.
 - <kbd>...args</kbd> <em>!(preact.VNode \| Array&lt;!preact.VNode&gt;)</em> (optional): Additional arguments are taken to be children to append. Can be infinitely nested Arrays.


### `createElement(`<br/>&nbsp;&nbsp;`nodeName: string|!Function,`<br/>&nbsp;&nbsp;`attributes=: Object,`<br/>&nbsp;&nbsp;`...args: !(preact.VNode|Array<!preact.VNode>),`<br/>`): !preact.VNode`
The pragma (rendering) function. Alias of `h`.

 - <kbd><strong>nodeName*</strong></kbd> <em>(string \| !Function)</em> : An element name. Ex: `div`, `a`, `span`, etc.
 - <kbd>attributes</kbd> <em>Object</em> (optional): Any attributes/props to set on the created element.
 - <kbd>...args</kbd> <em>!(preact.VNode \| Array&lt;!preact.VNode&gt;)</em> (optional): Additional arguments are taken to be children to append. Can be infinitely nested Arrays.
/**/