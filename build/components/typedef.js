const { h } = require('preact');
const { SyncReplaceable } = require('restream');
const md2html = require('./Html');
const { codeRe } = require('../lib/rules');
const { relative, dirname } = require('path');

/**
 * @param {Object} doc
 * @param {{ renderAgain: function(), locations, allTypes: Array<Type>}} doc.documentary
 */
function typedef({ documentary, children, name, narrow, flatten }) {
  const {
    setPretty, renderAgain, locations, allTypes, cutCode, currentFile,
    wiki,
  } = documentary
  const file = currentFile()

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
         h(Narrow,{...type,key:i, documentary:documentary })]
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

module.exports = typedef