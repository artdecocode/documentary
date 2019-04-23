import read from '@wrote/read'
import Md2Html from './Html'
import rexml from 'rexml'

const parse = (xml) => {
  const root = rexml('arguments', xml)
  if (!root.length)
    throw new Error('XML file should contain root arguments element.')

  const [{ content }] = root

  const allArgs = rexml('arg', content)
  const args = allArgs.map(({ content: description, props: {
    'command': command,
    'name': name,
    'boolean': boolean,
    'number': number,
    'multiple': multiple,
    'short': short,
    'toc': toc,
    'default': def,
  } }) => {
    return {
      description: description.trim(),
      command, boolean, number, multiple, short, name, toc, def,
    }
  })
  return args
}

/**
 * The component to show arguments as the table.
 * @param {!ArgufyProps} props Options for the Shell component. TODO: pass options.
 */
const Argufy = async (props) => {
  const {
    children,
    documentary,
  } = props
  const [child] = children
  const xml = await read(child)
  const args = parse(xml)
  const hasShort = args.some(({ short }) => short)
  const trs = args.map(({ command, description, name, short, toc, def }, i) => {
    const n = command ? name : `--${name}`
    const nn = toc ? `[${n}](t)` : n
    if (def) description += ` Default \`${def}\`.`
    const d = Md2Html({ children: [description], documentary })
    return (<tr key={i}>
      <td>{nn}</td>
      {hasShort && <td>{short ? `-${short}` : ''}</td>}
      <td dangerouslySetInnerHTML={{ __html: d }}></td>
    </tr>)
  })
  return (<table>
    <tr>
      <th>Argument</th>
      { hasShort && <th>Short</th>}
      <th>Description</th>
    </tr>
    {trs}
  </table>)
}

export default Argufy

/* documentary types/components/argufy.xml */
