import { makeMethodTable } from './Typedef/lib'
import { relative, dirname } from 'path'

export { default as shell } from './shell'
export { default as argufy } from './Argufy'
export { default as md2html } from './Html'
export { default as typedef } from './Typedef'
export { default as fork } from './fork'
export { default as java } from './java'

export default {
  'type-link'({ documentary }) {
    return documentary.removeLine()
  },
}

/**
 * @param {Object} params
 * @param {import('../lib/Documentary').default} params.documentary
 */
export function method({ name, level, documentary, children, noArgTypesInToc, 'just-heading': justHeading = false }) {
  let [ns,type,m] = name.split('.')
  if (!m) {
    m = type
    type = ns
    ns = ''
  }
  const fn = [ns, type].filter(Boolean).join('.')
  const foundType = documentary.allTypes.find(({ fullName }) => {
    return fullName == fn
  })
  if (!foundType) throw new Error(`Type ${fn} not found in ${children[0]}.`)
  const prop = foundType.properties.find(({ name: n }) => {
    return n == m
  })
  if (!prop) throw new Error(`Property ${m} of type ${fn} not found in ${children[0]}.`)
  const res = this.Method({
    method: prop,
    documentary: this,
    level,
    noArgTypesInToc,
  })

  const {
    _args: { wiki, source }, currentFile,
  } = documentary
  const file = wiki ? source : currentFile
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
  if (justHeading) return res
  let table = ''
  try {
    table = makeMethodTable(prop, documentary.allTypes, {
      link: linking,
    })
  } catch (err) {
    console.warn(err.message)
  }
  return [res, table].filter(Boolean).join('\n\n')
}
// export { default as method } from './method'
// export { default as method } from './Method/index'