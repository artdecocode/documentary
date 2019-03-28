const { debuglog } = require('util');

const jsDocRe = /( *) \* @param {(.+?)} (\[)?([^\s\]]+)\]?(?: .+)?((?:\n(?: +)\* @param {(?:.+?)} \[?\4\]?.*)*)/gm

const LOG = debuglog('doc')

const JSDocRule = {
  re: jsDocRe,
  replacement(match, ws, typeName, optional, paramName) {
    if (!(typeName in this.types)) {
      LOG('Type %s not found', typeName)
      return match
    }
    /** @type {Type} */
    const t = this.types[typeName]
    const s = t.toParam(paramName, optional, ws)
    return s
  },
}

/**
 * @typedef {import('./Type').default} Type
 */


module.exports=JSDocRule

module.exports.jsDocRe = jsDocRe