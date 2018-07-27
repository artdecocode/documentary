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

/**
 * @typedef {Object} Test This is test description.
 * @typedef {Object} SessionConfig Description of Session Config.
 * @prop {string} key cookie key.
 * @prop {number|'session'} [maxAge=86400000] maxAge in ms. Default is 1 day. `session` will result in a cookie that expires when session/browser is closed. Warning: If a session cookie is stolen, this cookie will never expire. Default `86400000`.
 * @prop {boolean} [overwrite] Can overwrite or not. Default `true`.
 * @prop {boolean} [httpOnly] httpOnly or not or not. Default `true`.
 * @prop {boolean} [signed=false] Signed or not. Default `true`.
 * @prop {boolean} [rolling] Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. Default `false`.
 * @prop {boolean} [renew] Renew session when session is nearly expired, so we can always keep user logged in. Default `false`.
 */
// console.log('test')
//# sourceMappingURL=index.js.map