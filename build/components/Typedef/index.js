const { h } = require('preact');
const { SyncReplaceable } = require('../../../stdlib');
const { relative, dirname } = require('path');
const md2html = require('../Html');
const { codeRe } = require('../../lib/rules');
const Method = require('../method');
const { makeMethodTable } = require('./lib');

// { renderAgain: function(), locations, allTypes: Array<Type>}

/**
 * @param {Object} opts
 * @param {Object} opts.documentary
 * @param {import('../../lib/Documentary').default} opts.documentary.documentary
 */
function Typedef({ documentary, children, name, narrow, 
  flatten, details, level, noArgTypesInToc = false,
}) {
  details = details ? details.split(',') : []
  const {
    setPretty, locations, allTypes, cutCode,
    wiki, source, documentary: doc,
  } = documentary
  const file = wiki ? source : doc.currentFile

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
    const LINE = Method({ documentary, level, method: type, noArgTypesInToc })
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

    const ch = isObject ?    h(Narrow,{...type,key:i, documentary:documentary }) : type
    if (displayInDetails) {
      const line = md2html({ documentary, children: [LINE] })

      if (isObject) return (   h('details',{},'\n ',
        h('summary',{'dangerouslySetInnerHTML':{ __html: line }}),'\n',
        ch,'\n',
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
    if (i < ar.length - 1) acc.push('\n')
    return acc
  }, [])

  return res
}

const Narrow = ({ props, anyHaveDefault, documentary }) => {
  const md = (name) => {
    return md2html({ documentary, children: [name] })
  }
  return (h('table',{},'\n ',
    h('thead',{},h('tr',{},'\n  ',
      h('th',{},`Name`),'\n  ',
      h('th',{},`Type & Description`),anyHaveDefault ? '\n  ' : '\n ' ,
      anyHaveDefault && h('th',{},`Default`),
      anyHaveDefault && '\n ',
    )),'\n',
    props.reduce((acc, { name, typeName, de, d, prop }) => {
      const hasCodes = new RegExp(codeRe.source, codeRe.flags).test(prop.description)
      de = de + '\n  '
      if (hasCodes) de = '\n\n' + de
      // let n = md(name)
      const { optional, aliases } = prop
      const a = optional ? aliases : aliases.map(al => `${al}*`)
      const n = [name, ...a]
      const r = (h('tr',{'key':name},'\n  ',
        h('td',{'rowSpan':"3",'align':"center"},
          n.reduce((ac, c, i, ar) => {
            ac.push(optional ? c : h('strong',{},c))
            if (i < ar.length - 1) ac.push(h('br'))
            return ac
          }, []),
        ),'\n  ',
        h('td',{},
          h('em',{'dangerouslySetInnerHTML':{ __html: md(typeName) }}),
        ),
        anyHaveDefault ? '\n  ' : '\n ',
        anyHaveDefault && h('td',{'dangerouslySetInnerHTML':{ __html: md(d) },'rowSpan':"3"}),
        anyHaveDefault && '\n ',
      ))
      const rr = h('tr',{},'\n  ',
        h('td',{'dangerouslySetInnerHTML':{ __html: hasCodes ? de : md(de) }}),'\n ',
      )

      acc.push(' ')
      acc.push(r)
      acc.push('\n ')
      acc.push(h('tr'))
      acc.push('\n ')
      acc.push(rr)
      acc.push('\n')
      return acc
    }, []),
  ))
}

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('typal/src/lib/Type').default} Type
 */

module.exports = Typedef