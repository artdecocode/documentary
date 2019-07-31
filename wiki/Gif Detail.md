The `GIF` rule will inserts a gif animation inside of a `<detail>` block. To highlight the summary with background color, `<code>` should be used instead of back-ticks. [[TOC title link|Tables-Of-Contents#toc-titles]] also work inside the summary.

```
%GIF doc.gif
Alt: Generating documentation.
Click to View: [<code>yarn doc</code>](t)
%
```

%GIF doc.gif
Alt: Generating documentation.
Click to View: [<code>yarn doc</code>](t)
%

---

The actual html placed in the `README` looks like the one below:

```html
<details>
  <summary>Summary of the detail: <code>yarn doc</code></summary>
  <table>
  <tr><td>
    <img alt="Alt: Generating documentation." src="doc.gif" />
  </td></tr>
  </table>
</details>
```