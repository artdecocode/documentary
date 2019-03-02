import read from '@wrote/read'

/**
 * Display the sponsor information.
 */
export const Sponsor = ({
  name, link, image, children,
}) => {
  return <table>
  <tr/>
  <tr>
    <td align="center">
      <a href={link}>
        <img src={image} alt={name}/>
      </a><br/>
      Sponsored by <a href={link}>{name}</a>.
    </td>
  </tr>
  {children && <tr><td>{children}</td></tr>}
</table>
}

/**
 * The async component to print the source of the document.
 */
export const Source = async ({ src }) => {
  const res = await read(src)
  const e = src.split('.')
  const ext = e[e.length - 1]
  return `\`\`\`${ext}
${res}
\`\`\``
}