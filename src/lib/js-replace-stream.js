import { Replaceable } from 'restream'
import typedefJsRule from './rules/typedef-js'
import { jsDocRe } from './typedef/jsdoc'
import { debuglog } from 'util'

const LOG = debuglog('doc')

class JSReplaceable extends Replaceable {
  constructor() {
    super([
      typedefJsRule,
      {
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
      },
    ])
    this._types = {}

    this.on('types', typedefs => {
      this.addTypes(typedefs)
    })
  }
  /**
   * Add types emited during typedefJsRule replacement.
   * @param {Type[]} typedefs
   */
  addTypes(typedefs) {
    const typedefsHash = typedefs.reduce((acc, typedef) => {
      return {
        ...acc,
        [typedef.name]: typedef,
      }
    }, {})
    this._types = {
      ...this._types,
      ...typedefsHash,
    }
  }
  /**
   * @type {Object.<string, Type>}
   */
  get types() {
    return this._types
  }
}

/** @typedef {import('./typedef/Type').default} Type */

export default function createJsReplaceStream() {
  const s = new JSReplaceable()

  return s
}