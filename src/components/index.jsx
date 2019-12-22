import { makeMethodTable } from './Typedef/lib'
import { makeLinking } from './Typedef'
import { getLink } from '../lib'

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

export const splitTypeMethod = (name) => {
  let [ns,type,m] = name.split('.')
  if (!m) {
    m = type
    type = ns
    ns = ''
  }
  const fullName = [ns, type].filter(Boolean).join('.')
  return { ns, type, method: m, fullName }
}

/**
 * The method for adding a heading and description of a method inside a constructor/interface.
 * @param {Object} params
 * @param {import('../lib/Documentary').default} params.documentary
 */
export function method({ name, level, documentary, children, noArgTypesInToc, 'just-heading': justHeading = false }) {
  const { method: m, fullName: fn } = splitTypeMethod(name)
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
    level,
    noArgTypesInToc,
  })

  const {
    _args: { wiki, source }, currentFile, error,
  } = documentary
  const file = wiki ? source : currentFile
  const linking = makeLinking(wiki, file, documentary)
  if (justHeading) return res
  let table = ''
  try {
    table = makeMethodTable(prop, documentary.allTypesWithIncluded, {
      link: linking,
      flatten: true,
    }, { documentary })
  } catch (err) {
    error(err)
  }
  return [res, table].filter(Boolean).join('\n\n')
}

/**
 * The method for adding a heading and description of a method inside a constructor/interface.
 * @param {Object} params
 * @param {import('../lib/Documentary').default} params.documentary
 */
export function link({ documentary, type, children, external }) {
  documentary.pretty(false)
  const foundType = documentary.allTypesWithIncluded.find((t) => {
    const { fullName, external: e } = t
    if (fullName != type) return false
    if (external) return e
    return true
  })
  if (!foundType) throw new Error(`Type ${type} not found.`)

  const {
    _args: { wiki, source }, currentFile,
  } = documentary
  const file = wiki ? source : currentFile
  const linking = makeLinking(wiki, file, documentary)

  if (foundType.link) {
    return (<a href={foundType.link} title={foundType.description}>{children}</a>)
  }
  const l = getLink(foundType.fullName, 'type')
  const ll = linking({ link: l, type: foundType })
  return (<a href={ll} title={foundType.description}>{children}</a>)
}

// export { default as method } from './method'
// export { default as method } from './Method/index'