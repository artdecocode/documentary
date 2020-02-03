const { h } = require('preact');
const { SyncReplaceable } = require('../../../stdlib');
const { relative, dirname } = require('path');
const md2html = require('../Html');
const { codeRe } = require('../../lib/rules');
const { makeMethodTable, makeIconsName } = require('./lib');
const { getLink } = require('../../lib');
const { EOL } = require('os');

// const extractPages = (props) => {
//   return Object.entries(props).reduce((acc, [key, val]) => {
//     if (key.startsWith('page-')) {
//       key = key.replace('page-', '')
//       acc[key] = val
//     }
//     return acc
//   }, {})
// }

/**
 * @param {string} wiki
 * @param {string} file
 * @param {Documentary} documentary
 */
const makeLinking = (wiki, file, documentary) => {
  /** @type {import('typal/types').ToMarkdownOptions} */
  const opts = {
    link({ link, type: refType }) {
      // when splitting wiki over multiple pages, allows
      // to create links to the exact page.
      if (refType.isMethod) {
        const { getSig } = documentary._method
        if (getSig) {
          const sig = getSig(refType)
          link = getLink(sig)
        }
      }
      const l = `#${link}`
      // <type-link> component will set `typeLink`
      if (refType.typeLink) return `${refType.typeLink}${l}`
      if (!wiki) return l

      // semi-hack
      const { appearsIn = [''] } = refType
      if (appearsIn.includes(file)) return l
      const ai = appearsIn[0] //
      if (!ai) documentary.error(new Error('appearsIn is empty'))
      let rel = relative(dirname(file), ai)
      if (wiki) rel = rel.replace(/\.(md|html)$/, '')
      return `${rel}${l}`
    },
  }
  return opts.link
}

/**
 * Prints the type definition table.
 * @param {Object} opts
 * @param {Documentary} opts.documentary
 * @param {boolean} [opts.print-imports=false] Add lines with imports
 * @param {boolean} opts.slimFunctions Don't add method tables with <kbd> for arguments.
 */
function Typedef({ documentary, children, name, narrow,
  'print-imports': noFlatten = false, flatten = !noFlatten, details, level,
  noArgTypesInToc = false, slimFunctions = false,
}) {
  details = details ? details.split(',') : []
  const {
    locations, allTypesWithIncluded, cut: { code: cutCode },
    _args: { wiki, source }, currentFile,
  } = documentary
  const file = wiki ? source : currentFile

  documentary.pretty(false)
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

  const linking = makeLinking(wiki, file, documentary)

  /**
   * @type {import('typal/types').LinkingOptions}
   */
  const opts = { details, narrow, flatten(n) {
    flattened[n] = true
  }, preprocessDesc(d) {
    if (!d) return d
    // cut ``` from properties, inserted by doc at the end
    const r = SyncReplaceable(d, [cutCode])
    return r
  }, link: linking, level,
  nameProcess: makeIconsName(allTypesWithIncluded, documentary) }

  const tt = typesToMd.map(type => {
    if (!type.isMethod) {
      const res = type.toMarkdown(allTypesWithIncluded, opts)
      if (level) res.LINE = res.LINE.replace(/t-type/, `${'#'.repeat(level)}-type`)
      return res
    }
    const LINE = documentary.Method({
      level, method: type, noArgTypesInToc,
    })
    const table = makeMethodTable(type, allTypesWithIncluded, opts, { documentary })
    return { LINE, table, examples: type.examples }
  })
  let j = []
  if (!flatten) {
    // found those imports that will be flattened
    const importsToMd = t
      .filter(({ import: i }) => i)
      .filter(({ fullName }) => !(fullName in flattened))

    j = importsToMd
      .map(i => i.toMarkdown(allTypesWithIncluded, { flatten }))
      .map(i => i.LINE)
  }

  const ttt = tt.map((s, i) => {
    const { LINE, table: type, displayInDetails } = s
    const isObject = typeof type == 'object' // table can be empty string, e.g., ''

    const ch = isObject ? (      h(Narrow,{...type,key:i,
      documentary:documentary, allTypes:allTypesWithIncluded, opts:opts,
      slimFunctions:slimFunctions
    })) : type
    if (displayInDetails) {
      const line = md2html({ documentary, children: [LINE] })

      if (isObject) return (   h('details',{},EOL + ' ',
        h('summary',{'dangerouslySetInnerHTML':{ __html: line }}),EOL,
        ch,EOL,
      ))

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
    if (i < ar.length - 1) acc.push(EOL)
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
  return (h('table',{},EOL + ' ',
    h('thead',{},h('tr',{},EOL + '  ',
      h('th',{},`Name`),EOL + '  ',
      h('th',{},`Type & Description`),anyHaveDefault ? EOL + '  ' : EOL + ' ' ,
      anyHaveDefault && h('th',{},constr ? 'Initial' : 'Default' ),
      anyHaveDefault && EOL + ' ',
    )),EOL,
    props.reduce((acc, { name, typeName, de, d, prop }) => {
      let desc = (prop.args && !slimFunctions) ? makeMethodTable(prop, allTypes, opts, {
        indent: '', join: '<br/>' + EOL, preargs: '<br/>' + EOL, documentary,
      }) : de
      let hasCodes
      if (prop.examples.length) {
        desc += `${EOL}${makeExamples(prop.examples)}`
        hasCodes = true
      } else {
        hasCodes = new RegExp(codeRe.source, codeRe.flags).test(prop.args ? desc : prop.description)
      }
      desc = desc + EOL + '  '
      if (hasCodes) desc = EOL + EOL + desc
      // let n = md(name)
      const { optional, aliases, static: isStatic } = prop
      const n = aliases.reduce((ac, al) => {
        if (!constr && !optional) al = `${al}*`
        // eslint-disable-next-line react/jsx-key
        ac.push([al, (h('sup',{},h('em',{},`alias`)))])
        return ac
      }, [name])
      const isMethodCol = anyHaveDefault && prop.args
      const row = (h('tr',{'key':name},EOL + '  ',
        h('td',{'rowSpan':"3",'align':"center"},
          n.reduce((ac, c, i, ar) => {
            c = Array.isArray(c) ? c : [c]
            let al
            ;[c, al] = c
            if (isStatic) ac.push(h('kbd',{},`static`), ' ')
            // eslint-disable-next-line react/jsx-key
            const u = constr ? [ h('ins',{},c), al] : [c]
            if (constr || optional) ac.push(...u)
            else ac.push(    h('strong',{},u))
            if (i < ar.length - 1) ac.push(h('br'))
            return ac
          }, []),
        ),EOL + '  ',
        h('td',{'colSpan':isMethodCol ? 2 : undefined},
          h('em',{'dangerouslySetInnerHTML':{ __html: md(typeName, [
            { re: /([_*])/g, replacement: '\\$1' }, // esc for md2html
          ]) }}),
        ),
        anyHaveDefault && !prop.args && EOL + '  ',
        anyHaveDefault && !prop.args && h('td',{'dangerouslySetInnerHTML':{ __html: md(d) },'rowSpan':"3"}),
        EOL + ' ',
      ))
      let D = desc
      if (!hasCodes) { // if it had codes, don't bother with markdown
        D = md(desc)
        if (D) D = D
          .replace(/^(?!%%_RESTREAM_CODE_REPLACEMENT)/gm, '   ')
          .replace(/^ +$/gm, '')
        if (D) D = `${EOL}${D}${EOL}  `
      }

      const descRow =       h('tr',{},EOL + '  ',
        h('td',{'colSpan':isMethodCol ? 2 : undefined,'dangerouslySetInnerHTML':{ __html: D }}),EOL + ' ',
      )

      acc.push(' ')
      acc.push(row)
      acc.push(EOL + ' ')
      acc.push(h('tr'))
      acc.push(EOL + ' ')
      acc.push(descRow)
      acc.push(EOL)
      return acc
    }, []),
  ))
}

// from typal/src/Property.js
/**
 * Parse examples into string.
 * When /// lines are found, they are not part of code blocks.
 */
const makeExamples = (examples) => {
  const pp = []
  examples.forEach((example) => {
    const exampleLines = example.split(EOL)
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
          acc.push(currentComment.join(EOL))
          currentComment = []
        } else {
          acc.push(currentBlock.join(EOL))
          currentBlock = []
        }
        state = newState
      }
      return acc
    }, [])
    if (currentComment.length) {
      eg.push(currentComment.join(EOL))
    } else if (currentBlock.length) {
      eg.push(currentBlock.join(EOL))
    }
    eg = eg.reduce((acc, e) => {
      if (e.startsWith('///')) {
        e = e.replace(/^\/\/\/\s+/gm, '')
        acc.push(...e.split(EOL))
      } else {
        acc.push('```js')
        acc.push(...e.split(EOL))
        acc.push('```')
      }
      return acc
    }, [])
    pp.push(...eg)
  })
  return pp.join(EOL)
}

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('typal/types').Type} Type
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('typal/types').Property} Property
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../../lib/Documentary').default} Documentary
 */


module.exports = Typedef
module.exports.makeLinking = makeLinking