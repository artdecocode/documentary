import { SyncReplaceable } from 'restream'
import { relative, dirname } from 'path'
import md2html from '../Html'
import { codeRe } from '../../lib/rules'
import Method from '../method'
import { makeMethodTable } from './lib'

// const extractPages = (props) => {
//   return Object.entries(props).reduce((acc, [key, val]) => {
//     if (key.startsWith('page-')) {
//       key = key.replace('page-', '')
//       acc[key] = val
//     }
//     return acc
//   }, {})
// }

export const makeLinking = (wiki, file) => {
  const linking = ({ link, type: refType }) => {
    // when splitting wiki over multiple pages, allows
    // to create links to the exact page.
    const l = `#${link}`
    // <type-link> component will set `typeLink`
    if (refType.typeLink) return `${refType.typeLink}${l}`

    // semi-hack
    const { appearsIn = [''] } = refType
    if (appearsIn.includes(file)) return l
    const ai = appearsIn[0] //
    let rel = relative(dirname(file), ai)
    if (wiki) rel = rel.replace(/\.(md|html)$/, '')
    return `${rel}${l}`
  }
  return linking
}

/**
 * @param {Object} opts
 * @param {import('../../lib/Documentary').default} opts.documentary
 */
export default function Typedef({ documentary, children, name, narrow,
  flatten, details, level, noArgTypesInToc = false, slimFunctions = false,
}) {
  details = details ? details.split(',') : []
  const {
    locations, allTypes, cut: { code: cutCode },
    _args: { wiki, source }, currentFile, _typedefs,
  } = documentary
  const file = wiki ? source : currentFile

  const at = [...allTypes, ..._typedefs.included]

  documentary.setPretty(false)
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

  const linking = makeLinking(wiki, file)

  const preprocessDesc = (d) => {
    if (!d) return d
    // cut ``` from properties, inserted by doc at the end
    const r = SyncReplaceable(d, [cutCode])
    return r
  }

  const opts = { details, narrow, flatten(n) {
    flattened[n] = true
  }, preprocessDesc, link: linking, level }

  const tt = typesToMd.map(type => {
    if (!type.isMethod) {
      const res = type.toMarkdown(at, opts)
      if (level) res.LINE = res.LINE.replace(/t-type/, `${'#'.repeat(level)}-type`)
      return res
    }
    const LINE = Method({ documentary, level, method: type, noArgTypesInToc })
    const table = makeMethodTable(type, at, opts)
    return { LINE, table, examples: type.examples }
  })
  // found those imports that will be flattened
  const importsToMd = t
    .filter(({ import: i }) => i)
    .filter(({ fullName }) => !(fullName in flattened))

  const j = importsToMd.map(i => i.toMarkdown(at, { flatten }))

  const ttt = tt.map((s, i) => {
    const { LINE, table: type, displayInDetails } = s
    const isObject = typeof type == 'object' // table can be empty string, e.g., ''

    const ch = isObject ? <Narrow key={i} {...type}
      documentary={documentary} allTypes={at} opts={opts}
      slimFunctions={slimFunctions}
    /> : type
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

/**
 * @param {Object} opts
 * @param {!Array<{ prop: Property }>} opts.props
 * @param {boolean} opts.const Whether the type is a constructor or interface.
 * @param {string[]} opts.examples Examples for the constructor.
 * @param {boolean} opts.constr Whether this is a table for the interface/constructor.
 */
const Narrow = ({ props, anyHaveDefault, documentary, constr, allTypes, opts,
  slimFunctions }) => {
  const md = (name, afterCutLinks) => {
    return md2html({ documentary, children: [name], afterCutLinks })
  }
  return (<table>{'\n '}
    <thead><tr>{'\n  '}
      <th>Name</th>{'\n  '}
      <th>Type & Description</th>{anyHaveDefault ? '\n  ' : '\n ' }
      {anyHaveDefault && <th>{constr ? 'Initial' : 'Default' }</th>}
      {anyHaveDefault && '\n '}
    </tr></thead>{'\n'}
    {props.reduce((acc, { name, typeName, de, d, prop }) => {
      let desc = (prop.args && !slimFunctions) ? makeMethodTable(prop, allTypes, opts, {
        indent: '', join: '<br/>\n', preargs: '<br/>\n',
      }) : de
      let hasCodes
      if (prop.examples.length) {
        desc += `\n${makeExamples(prop.examples)}`
        hasCodes = true
      } else {
        hasCodes = new RegExp(codeRe.source, codeRe.flags).test(prop.args ? desc : prop.description)
      }
      desc = desc + '\n  '
      if (hasCodes) desc = '\n\n' + desc
      // let n = md(name)
      const { optional, aliases, static: isStatic } = prop
      const n = aliases.reduce((ac, al) => {
        if (!constr && !optional) al = `${al}*`
        // eslint-disable-next-line react/jsx-key
        ac.push([al, (<sup><em>alias</em></sup>)])
        return ac
      }, [name])
      const isMethodCol = anyHaveDefault && prop.args
      const row = (<tr key={name}>{'\n  '}
        <td rowSpan="3" align="center">
          {n.reduce((ac, c, i, ar) => {
            c = Array.isArray(c) ? c : [c]
            let al
            ;[c, al] = c
            if (isStatic) ac.push(<kbd>static</kbd>, ' ')
            // eslint-disable-next-line react/jsx-key
            const u = constr ? [<ins>{c}</ins>, al] : [c]
            if (constr || optional) ac.push(...u)
            else ac.push(<strong>{u}</strong>)
            if (i < ar.length - 1) ac.push(<br/>)
            return ac
          }, [])}
        </td>{'\n  '}
        <td colSpan={isMethodCol ? 2 : undefined}>
          <em dangerouslySetInnerHTML={{ __html: md(typeName, [
            { re: /([_*])/g, replacement: '\\$1' }, // esc for md2html
          ]) }}/>
        </td>
        {anyHaveDefault && !prop.args && '\n  '}
        {anyHaveDefault && !prop.args && <td rowSpan="3"
          dangerouslySetInnerHTML={{ __html: md(d) }}/>}
        {'\n '}
      </tr>)
      let D = desc
      if (!hasCodes) { // if it had codes, don't bother with markdown
        D = md(desc)
        if (D) D = D
          .replace(/^(?!%%_RESTREAM_CODE_REPLACEMENT)/gm, '   ')
          .replace(/^ +$/gm, '')
        if (D) D = `\n${D}\n  `
      }

      const descRow = <tr>{'\n  '}
        <td colSpan={isMethodCol ? 2 : undefined}
          dangerouslySetInnerHTML={{ __html: D }} />{'\n '}
      </tr>

      acc.push(' ')
      acc.push(row)
      acc.push('\n ')
      acc.push(<tr />)
      acc.push('\n ')
      acc.push(descRow)
      acc.push('\n')
      return acc
    }, [])}
  </table>)
}

// from typal/src/Property.js
/**
 * Parse examples into string.
 * When /// lines are found, they are not part of code blocks.
 */
const makeExamples = (examples) => {
  const pp = []
  examples.forEach((example) => {
    const exampleLines = example.split('\n')
    let currentComment = [], currentBlock = []
    let state = '', newState
    let eg = exampleLines.reduce((acc, current) => {
      if (current.startsWith('///')) {
        newState = 'comment'
        currentComment.push(current)
      } else {
        newState = 'block'
        currentBlock.push(current)
      }
      if (!state) state = newState
      if (newState != state) {
        if (newState == 'block') {
          acc.push(currentComment.join('\n'))
          currentComment = []
        } else {
          acc.push(currentBlock.join('\n'))
          currentBlock = []
        }
        state = newState
      }
      return acc
    }, [])
    if (currentComment.length) {
      eg.push(currentComment.join('\n'))
    } else if (currentBlock.length) {
      eg.push(currentBlock.join('\n'))
    }
    eg = eg.reduce((acc, e) => {
      if (e.startsWith('///')) {
        e = e.replace(/^\/\/\/\s+/gm, '')
        acc.push(...e.split('\n'))
      } else {
        acc.push('```js')
        acc.push(...e.split('\n'))
        acc.push('```')
      }
      return acc
    }, [])
    pp.push(...eg)
  })
  return pp.join('\n')
}

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('typal/types').Type} Type
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('typal/types').Property} Property
 */
