## produces title for method with args and return
```#### async runSoftware => string
[
  ["path", "string"],
  ["config", {
    "View": ["Container"],
    "actions": ["object"],
    "static?": ["boolean", true],
    "render?": ["function"]
  }, "Config"]
]
```

/* expected */
#### <code>async <ins>runSoftware</ins>(</code><sup><br/>&nbsp;&nbsp;`path: string,`<br/>&nbsp;&nbsp;`config: {`<br/>&nbsp;&nbsp;&nbsp;&nbsp;`View: Container,`<br/>&nbsp;&nbsp;&nbsp;&nbsp;`actions: object,`<br/>&nbsp;&nbsp;&nbsp;&nbsp;`static?: boolean = true,`<br/>&nbsp;&nbsp;&nbsp;&nbsp;`render?: function,`<br/>&nbsp;&nbsp;`},`<br/></sup><code>): <i>string</i></code>
/**/

## produces title for method without args or return
```#### runSoftware
```

Generated from

/* expected */
#### <code><ins>runSoftware</ins>(): <i>void</i></code>

Generated from
/**/