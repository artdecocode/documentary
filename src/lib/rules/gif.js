`%GIF path-to-file
alt
summary
%`

const gifRe = /^%GIF (.+)\n(.+)\n(.+)\n%$/mg

export { gifRe }

const gifRule = {
  re: gifRe,
  replacement(match, path, alt, summary) {
    const r = b(summary, alt, path)
    return r
  },
}

const b = (summary, alt, gif) => {
  return `
<details>
  <summary>${summary}</summary>
  <table>
  <tr><td>
    <img alt="${alt}" src="${gif}" />
  </td></tr>
  </table>
</details>
`.trim()
}

export default gifRule
