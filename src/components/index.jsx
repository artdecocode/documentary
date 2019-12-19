import { makeMethodTable } from './Typedef/lib'
import { makeLinking } from './Typedef'

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
  'include-typedefs'({ documentary }) {
    return documentary.removeLine()
  },
}

/**
 * The method for adding a heading and description of a method inside a constructor/interface.
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
    _args: { wiki, source }, currentFile, error,
  } = documentary
  const file = wiki ? source : currentFile
  const linking = makeLinking(wiki, file)
  if (justHeading) return res
  let table = ''
  try {
    table = makeMethodTable(prop, documentary.allTypesWithIncluded, {
      link: linking,
      flatten(n) {
        // debugger
        // flattened[n] = true
      },
    }, { wiki })
  } catch (err) {
    error(err)
  }
  return [res, table].filter(Boolean).join('\n\n')
}
// export { default as method } from './method'
// export { default as method } from './Method/index'