const { h } = require('preact');
const $_shell = require('./shell');
const $_Argufy = require('./Argufy');
const $_Html = require('./Html');
const $_Typedef = require('./Typedef');
const $_fork = require('./fork');
const $_java = require('./java');

/**
 * @param {Object} params
 * @param {import('../lib/Documentary').default} params.documentary
 */
function method({ name, level, documentary, children, noArgTypesInToc }) {
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
  return res
}
// export { default as method } from './method'
// export { default as method } from './Method/index'

module.exports.method = method
module.exports.shell = $_shell
module.exports.argufy = $_Argufy
module.exports.md2html = $_Html
module.exports.typedef = $_Typedef
module.exports.fork = $_fork
module.exports.java = $_java