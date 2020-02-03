import { EOL } from 'os'
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
 * @param {Object} props Options for the Shell component. TODO: pass options.
 * @param {import('../lib/Documentary').default} props.documentary
 */
const Argufy = async ({ children, documentary }) => {
  documentary.setPretty(false)
  const [child] = children
  const xml = await read(child)
  const args = parse(xml)
  const hasShort = args.some(({ short }) => short)
  const trs = args.reduce((acc, { command, description, name, short, toc, def }, i) => {
    const n = command ? name : `--${name}`
    const nn = toc ? `[${n}](t)` : n
    if (def) description += ` Default \`${def}\`.`
    const d = Md2Html({ children: [description], documentary })

    const r = (<tr key={i}>{EOL + '   '}
      <td>{nn}</td>{EOL + '   '}
      {hasShort && <td>{short ? `-${short}` : ''}</td>}
      {hasShort && EOL + '   '}
      <td dangerouslySetInnerHTML={{ __html: d }}/>{EOL + '  '}
    </tr>)

    acc.push('  ')
    acc.push(r)
    acc.push(EOL + '')
    return acc
  }, [])
  return (<table>{EOL + ' '}
    <thead>{EOL + '  '}
      <tr>{EOL + '   '}
        <th>Argument</th> {EOL + '   '}
        { hasShort && <th>Short</th>}
        { hasShort && EOL + '   '}
        <th>Description</th>{EOL + '  '}
      </tr>{EOL + ' '}
    </thead>{EOL + ''}
    {trs}
  </table>)
}

export default Argufy

/* documentary types/components/argufy.xml */
