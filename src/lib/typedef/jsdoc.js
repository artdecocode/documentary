import { debuglog } from 'util'

const jsDocRe = / \* @param {(.+?)} \[?([^\s\]]+)\]?(?: .+)?((?:\n \* @param {(?:.+?)} \[?\2\]?.*)*)/gm

const LOG = debuglog('doc')

const JSDocRule = {
  re: jsDocRe,
  replacement(match, typeName, paramName) {
    if (!(typeName in this.types)) {
      LOG('Type %s not found', typeName)
      return match
    }
    /** @type {Type} */
    const t = this.types[typeName]
    const s = t.toParam(paramName)
    return s
  },
}

export { jsDocRe }
export default JSDocRule