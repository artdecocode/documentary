import { debuglog } from 'util'

const jsDocRe = / \* @param {(.+?)} (\[)?([^\s\]]+)\]?(?: .+)?((?:\n \* @param {(?:.+?)} \[?\3\]?.*)*)/gm

const LOG = debuglog('doc')

const JSDocRule = {
  re: jsDocRe,
  replacement(match, typeName, optional, paramName) {
    if (!(typeName in this.types)) {
      LOG('Type %s not found', typeName)
      return match
    }
    /** @type {Type} */
    const t = this.types[typeName]
    const s = t.toParam(paramName, optional)
    return s
  },
}

/**
 * @typedef {import('./Type').default} Type
 */

export { jsDocRe }
export default JSDocRule