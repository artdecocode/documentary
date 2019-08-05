import { SyncReplaceable } from 'restream'
import { relative, dirname } from 'path'
import md2html from '../Html'
import { codeRe } from '../../lib/rules'
import Method from '../method'
import { makeMethodTable } from './lib'

/**
 * @param {Object} doc
 * @param {{ renderAgain: function(), locations, allTypes: Array<Type>}} doc.documentary
 */
export default function Typedef({ documentary, children, name, narrow, 
  flatten, details, level, noArgTypesInToc = false,
}) {
  details = details ? details.split(',') : []
  const {
    setPretty, locations, allTypes, cutCode, currentFile,
    wiki, source,
  } = documentary
  const file = wiki ? source : currentFile()

  setPretty(false)
  let [location] = children
  location = location.trim()
  /** @type {!Array<!Type>} */
  const types = locations[location]
  if (!types) {
    throw new Error(`No types for location ${location}`, )
  }
  const t = name ? types.filter(a => a.name == name) : types

  const typesToMd = t.filter(({ import: i }) => !i)
  let flattened = {}
  
  const linking = ({ link, type: refType }) => {
    // when splitting wiki over multiple pages, allows
    // to create links to the exact page.
    const l = `#${link}`
    // semi-hack
    if (refType.appearsIn.includes(file)) return l
    const ai = refType.appearsIn[0]
    let rel = relative(dirname(file), ai)
    if (wiki) rel = rel.replace(/\.(md|html)$/, '')
    return `${rel}${l}`
  }
  const preprocessDesc = (d) => {
    if (!d) return d
    // cut ``` from properties, inserted by doc at the end
    const r = SyncReplaceable(d, [cutCode])
    return r
  }

  const tt = typesToMd.map(type => { 
    const opts = { details, narrow, flatten(n) {
      flattened[n] = true
    }, preprocessDesc, link: linking, level }
    
    if (!type.isMethod) {
      const res = type.toMarkdown(allTypes, opts)
      return res
    }
    const LINE = Method({ documentary, level, method: type })
    const table = makeMethodTable(type, allTypes, opts)
    return { LINE, table }
  })
  // found those imports that will be flattened
  const importsToMd = t
    .filter(({ import: i }) => i)
    .filter(({ fullName }) => !(fullName in flattened))

  const j = importsToMd.map(i => i.toMarkdown(allTypes, { flatten }))

  const ttt = tt.map((s, i) => {
    const { LINE, table: type, displayInDetails } = s
    const isObject = typeof type == 'object' // table can be empty string, e.g., ''

    const ch = isObject ? <Narrow key={i} {...type} documentary={documentary} /> : type
    if (displayInDetails) {
      const line = md2html({ documentary, children: [LINE] })

      if (isObject) return (<details>{'\n '}
        <summary dangerouslySetInnerHTML={{ __html: line }} />{'\n'}
        {ch}{'\n'}
      </details>)

      return `<details>
 <summary>${line}</summary>${ch}
</details>`
    }
    const r = [LINE]
    if (ch) r.push(ch)
    return r
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