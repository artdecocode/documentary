const { h } = require('preact');
const { read } = require('../../stdlib');
const Md2Html = require('./Html');
const { rexml } = require('../../stdlib');

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

    const r = (h('tr',{'key':i},'\n   ',
      h('td',{},nn),'\n   ',
      hasShort && h('td',{},short ? `-${short}` : ''),
      hasShort && '\n   ',
      h('td',{'dangerouslySetInnerHTML':{ __html: d }}),'\n  ',
    ))

    acc.push('  ')
    acc.push(r)
    acc.push('\n')
    return acc
  }, [])
  return (h('table',{},'\n ',
    h('thead',{},'\n  ',
      h('tr',{},'\n   ',
        h('th',{},`Argument`),` `,'\n   ',
         hasShort && h('th',{},`Short`),
         hasShort && '\n   ',
        h('th',{},`Description`),'\n  ',
      ),'\n ',
    ),'\n',
    trs,
  ))
}

module.exports=Argufy

/* documentary types/components/argufy.xml */
