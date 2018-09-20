const { Replaceable } = require('restream');
let typedefJsRule = require('./rules/typedef-js'); if (typedefJsRule && typedefJsRule.__esModule) typedefJsRule = typedefJsRule.default;
let JSDocRule = require('./typedef/jsdoc'); if (JSDocRule && JSDocRule.__esModule) JSDocRule = JSDocRule.default;

               class JSDocumentary extends Replaceable {
  constructor() {
    super([
      typedefJsRule,
      JSDocRule,
    ])
    this._types = {}

    this.on('types', typedefs => {
      this.addTypes(typedefs)
    })
  }
  /**
   * Add types emitted during typedefJsRule replacement.
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


module.exports = JSDocumentary
//# sourceMappingURL=JSDocumentary.js.map