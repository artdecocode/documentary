import { SyncReplaceable } from 'restream'
import md2html from './Html'
import { codeRe } from '../lib/rules'
import { relative, dirname } from 'path'

/**
 * @param {Object} doc
 * @param {{ renderAgain: function(), locations, allTypes: Array<Type>}} doc.documentary
 */
export default function typedef({ documentary, children, name, narrow, flatten }) {
  const {
    setPretty, renderAgain, locations, allTypes, cutCode, currentFile,
    wiki, source,
  } = documentary
  const file = wiki ? source : currentFile()

  setPretty(false)
  renderAgain() // because using md2html
  const [location] = children
  /** @type {!Array<!Type>} */
  const types = locations[location]
  if (!types) {
    throw new Error(`No types for location ${location}`, )
  }
  const t = name ? types.filter(a => a.name == name) : types

  const typesToMd = t.filter(({ import: i }) => !i)
  let flattened = {}
  const tt = typesToMd.map(type => {
    return type.toMarkdown(allTypes, { narrow, flatten(n) {
      flattened[n] = true
    }, preprocessDesc(d) {
      if (!d) return d
      // cut ``` from properties, inserted by doc at the end
      const r = SyncReplaceable(d, [cutCode])
      return r
    }, link({ link, type: refType }) {
      // when splitting wiki over multiple pages, allows
      // to create links to the exact page.
      const l = `#${link}`
      // semi-hack
      if (refType.appearsIn.includes(file)) return l
      const ai = refType.appearsIn[0]
      let rel = relative(dirname(file), ai)
      if (wiki) rel = rel.replace(/\.(md|html)$/, '')
      return `${rel}${l}`
    } }
    )})
  // found those imports that will be flattened
  const importsToMd = t
    .filter(({ import: i }) => i)
    .filter(({ fullName }) => !(fullName in flattened))

  const j = importsToMd.map(i => i.toMarkdown(allTypes, { flatten }))

  const ttt = tt.map((s, i) => {
    if (typeof s == 'string') return s
    const { LINE, table: type } = s
    if (typeof type == 'object') return [LINE,
      <Narrow key={i} {...type} documentary={documentary} />]
    return [LINE, type]
  })

  const res = [...j, ...ttt].reduce((acc, c, i, ar) => {
    acc.push(...(Array.isArray(c) ? c : [c]))
    if (i < ar.length - 1) acc.push('\n')
    return acc
  }, [])

  return res
}

const Narrow = ({ props, anyHaveDefault, documentary }) => {
  const md = (name) => {
    return md2html({ documentary, children: [name] })
  }
  return (<table>{'\n '}
    <thead><tr>{'\n  '}
      <th>Name</th>{'\n  '}
      <th>Type & Description</th>{anyHaveDefault ? '\n  ' : '\n ' }
      {anyHaveDefault && <th>Default</th>}
      {anyHaveDefault && '\n '}
    </tr></thead>{'\n'}
    {props.reduce((acc, { name, typeName, de, d, prop }) => {
      const hasCodes = new RegExp(codeRe.source, codeRe.flags).test(prop.description)
      de = de + '\n  '
      if (hasCodes) de = '\n\n' + de
      // let n = md(name)
      const { optional, aliases } = prop
      const a = optional ? aliases : aliases.map(al => `${al}*`)
      const n = [name, ...a]
      const r = (<tr key={name}>{'\n  '}
        <td rowSpan="3" align="center">
          {n.reduce((ac, c, i, ar) => {
            ac.push(optional ? c : <strong>{c}</strong>)
            if (i < ar.length - 1) ac.push(<br/>)
            return ac
          }, [])}
        </td>{'\n  '}
        <td>
          <em dangerouslySetInnerHTML={{ __html: md(typeName) }}/>
        </td>
        {anyHaveDefault ? '\n  ' : '\n '}
        {anyHaveDefault && <td rowSpan="3"
          dangerouslySetInnerHTML={{ __html: md(d) }}/>}
        {anyHaveDefault && '\n '}
      </tr>)
      const rr = <tr>{'\n  '}
        <td dangerouslySetInnerHTML={{ __html: hasCodes ? de : md(de) }} />{'\n '}
      </tr>

      acc.push(' ')
      acc.push(r)
      acc.push('\n ')
      acc.push(<tr />)
      acc.push('\n ')
      acc.push(rr)
      acc.push('\n')
      return acc
    }, [])}
  </table>)
}

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('typal/src/lib/Type').default} Type
 */