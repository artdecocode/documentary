"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.typedefJsRe = void 0;

var _util = require("util");

var _rexml = _interopRequireDefault(require("rexml"));

var _ = require("..");

var _Type = _interopRequireDefault(require("../typedef/Type"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LOG = (0, _util.debuglog)('doc');
const typedefJsRe = /^\/\* documentary (.+?) \*\/\n(?:([^\n][\s\S]+?\n))?$/mg; // const makePropsDesc = (props) => {
//   return ''
//   if (!props.length) return ''
//   const l = props.map(({ props: { name, opt } }) => {
//     const n = opt ? `[${name}]` : name
//     return `\`${n}\``
//   })
//   return `Has properties: ${l.join(', ')}.`
// }

exports.typedefJsRe = typedefJsRe;

const makeBlock = s => {
  return `/**
${s}
 */
`;
};
/**
 * @typedef {import('restream').AsyncReplacer} AsyncReplacer
 * @type {{re: RegExp, replacement: AsyncReplacer}}
 */


const typedefRule = {
  re: typedefJsRe,

  async replacement(match, location) {
    try {
      LOG('Detected type marker: %s', location);
      const xml = await (0, _.read)(location);
      const root = (0, _rexml.default)('types', xml);
      if (!root.length) throw new Error('XML file should contain root types element.');
      const [{
        content: Root
      }] = root;
      const types = (0, _rexml.default)('type', Root);
      const typedefs = types.map(({
        content,
        props
      }) => {
        const tt = new _Type.default();
        tt.fromXML(content, props);
        return tt;
      });
      this.emit('types', typedefs); // remember types for js-replace-stream

      const ts = typedefs.map(tt => tt.toTypedef()); // imports

      const is = (0, _rexml.default)('import', Root).map(({
        props: {
          name,
          from
        }
      }) => ` * @typedef {import('${from}').${name}} ${name}`);
      const iss = is.join('\n');
      const tss = ts.join('\n *\n');
      const importsAndTypes = `${is.length ? `${iss}\n *\n` : ''}${tss}`;
      const b = makeBlock(importsAndTypes);
      const typedef = `/* documentary ${location} */\n${b}`;
      return typedef;
    } catch (e) {
      LOG('(%s) Could not process typedef-js: %s', location, e.message);
      return match;
    }
  }

};
var _default = typedefRule;
exports.default = _default;
//# sourceMappingURL=typedef-js.js.map