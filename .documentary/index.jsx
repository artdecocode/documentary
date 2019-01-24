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