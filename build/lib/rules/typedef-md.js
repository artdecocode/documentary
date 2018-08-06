"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.typedefMdRe = void 0;

var _util = require("util");

var _rexml = _interopRequireDefault(require("rexml"));

var _2 = require("..");

var _Type = _interopRequireDefault(require("../typedef/Type"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LOG = (0, _util.debuglog)('doc');
const typedefMdRe = /^%TYPEDEF (.+?)(?: (.+?))?%$/mg;
/**
 * This rule is used to used to parse a typedefs XML file and place the
 * definition of a type into documentation.
 * @todo Cache extracted types from XML files.
 * @type {{re: RegExp, replacement: AsyncReplacer}}
 */

exports.typedefMdRe = typedefMdRe;
const typedefMdRule = {
  re: typedefMdRe,

  async replacement(match, location, typeName) {
    try {
      const xml = await (0, _2.read)(location);
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
        const type = new _Type.default();
        type.fromXML(content, props);
        return type;
      });
      const imports = (0, _rexml.default)('import', Root).map(({
        props: {
          name,
          from,
          desc
        }
      }) => {
        const type = new _Type.default();
        type.fromXML('', {
          name,
          type: `import('${from}').${name}`,
          noToc: true,
          import: true,
          desc
        });
        return type;
      });
      const ft = [...imports, ...typedefs].filter(({
        name
      }) => {
        if (typeName) return name == typeName;
        return true;
      });
      this.emit('types', ft.map(({
        name
      }) => name));
      if (typeName && !ft.length) throw new Error(`Type ${typeName} not found.`);
      const mdt = ft.map((type, _, a) => {
        return type.toMarkdown(a);
      });
      return mdt.join('\n\n');
    } catch (e) {
      LOG('(%s) Could not process typedef-md: %s', location, e.message);
      return match;
    }
  }

};
/**
 * @typedef {import('restream').AsyncReplacer} AsyncReplacer
 */

var _default = typedefMdRule;
exports.default = _default;
//# sourceMappingURL=typedef-md.js.map