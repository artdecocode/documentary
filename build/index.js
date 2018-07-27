"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = documentary;
Object.defineProperty(exports, "Toc", {
  enumerable: true,
  get: function () {
    return _Toc.default;
  }
});

var _Toc = _interopRequireDefault(require("./lib/Toc"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This is the main package file.
 */
async function documentary() {
  console.log('documentary called');
}
/**
 * A nested structure representing levels of headers in the MarkDown file.
 * @param {Readable} structure
 */
// export const toc = (readable) => {
//   // const t = new Tran
//   // return Object.keys(structure)
// }
//# sourceMappingURL=index.js.map