"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createJsReplaceStream;

var _restream = require("restream");

var _typedefJs = _interopRequireDefault(require("./rules/typedef-js"));

var _jsdoc = _interopRequireDefault(require("./typedef/jsdoc"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class JSReplaceable extends _restream.Replaceable {
  constructor() {
    super([_typedefJs.default, _jsdoc.default]);
    this._types = {};
    this.on('types', typedefs => {
      this.addTypes(typedefs);
    });
  }
  /**
   * Add types emited during typedefJsRule replacement.
   * @param {Type[]} typedefs
   */


  addTypes(typedefs) {
    const typedefsHash = typedefs.reduce((acc, typedef) => {
      return { ...acc,
        [typedef.name]: typedef
      };
    }, {});
    this._types = { ...this._types,
      ...typedefsHash
    };
  }
  /**
   * @type {Object.<string, Type>}
   */


  get types() {
    return this._types;
  }

}
/** @typedef {import('./typedef/Type').default} Type */


function createJsReplaceStream() {
  const s = new JSReplaceable();
  return s;
}
//# sourceMappingURL=js-replace-stream.js.map