const { h } = require('preact');
const { makeMethodTable } = require('./Typedef/lib');
const { makeLinking } = require('./Typedef');
const { getLink } = require('../lib');

const $_shell = require('./shell');
const $_Argufy = require('./Argufy');
const $_Html = require('./Html');
const $_Typedef = require('./Typedef');
const $_fork = require('./fork');
const $_java = require('./java');

module.exports={
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
function method({ name, level, documentary, children, noArgTypesInToc, 'just-heading': justHeading = false }) {
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

/**
 * The method for adding a heading and description of a method inside a constructor/interface.
 * @param {Object} params
 * @param {import('../lib/Documentary').default} params.documentary
 */
function link({ documentary, type, children }) {
  documentary.pretty(false)
  const foundType = documentary.allTypesWithIncluded.find(({ fullName }) => {
    return fullName == type
  })
  if (!foundType) throw new Error(`Type ${type} not found.`)

  const {
    _args: { wiki, source }, currentFile, error,
  } = documentary
  const file = wiki ? source : currentFile
  const linking = makeLinking(wiki, file, error)

  if (foundType.link) {
    return (h('a',{'href':foundType.link, 'title':foundType.description},children))
  }
  const l = getLink(foundType.fullName, 'type')
  const ll = linking({ link: l, type: foundType })
  return (h('a',{'href':ll, 'title':foundType.description},children))
}

// export { default as method } from './method'
// export { default as method } from './Method/index'

module.exports.method = method
module.exports.link = link
module.exports.shell = $_shell
module.exports.argufy = $_Argufy
module.exports.md2html = $_Html
module.exports.typedef = $_Typedef
module.exports.fork = $_fork
module.exports.java = $_java