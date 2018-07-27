"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getPropType = exports.typedefJsRe = void 0;

var _util = require("util");

var _rexml = _interopRequireDefault(require("rexml"));

var _ = require("..");

var _typedef = require("../typedef");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LOG = (0, _util.debuglog)('doc');
const typedefJsRe = /^\/\* documentary (.+?) \*\/\n(?:([^\n][\s\S]+?\n))?$/mg;
exports.typedefJsRe = typedefJsRe;

const makeProp = (name, opt, type = '*', defaultValue, desc = '') => {
  if (!name) throw new Error('Property does not have a value.');
  const n = (0, _typedef.getNameWithDefault)(name, defaultValue, type);
  const nn = opt ? `[${n}]` : n;
  const d = defaultValue !== undefined ? ` Default \`${defaultValue}\`.` : '';
  const p = ` * @prop {${type}} ${nn} ${desc}${d}`;
  return p;
};

const getPropType = ({
  number,
  string,
  boolean,
  type
}) => {
  if (string) return 'string';
  if (number) return 'number';
  if (boolean) return 'boolean';
  if (type) return type;
  return 'any';
};

exports.getPropType = getPropType;

const makePropsDesc = props => {
  return ''; // if (!props.length) return ''
  // const l = props.map(({ props: { name, opt } }) => {
  //   const n = opt ? `[${name}]` : name
  //   return `\`${n}\``
  // })
  // return `Has properties: ${l.join(', ')}.`
};

const makeType = (name, type = 'Object', desc, props) => {
  if (!name) throw new Error('Type does not have a name.');
  const pd = makePropsDesc(props);
  const t = ` * @typedef {${type}} ${name}${desc ? ` ${desc}` : ''}${pd ? ` ${pd}` : ''}`;
  const ps = props.map(({
    content,
    props: {
      name: propName,
      opt,
      default: defaultVal,
      ...propType
    }
  }) => {
    const pt = getPropType(propType);
    const p = makeProp(propName, opt, pt, defaultVal, content);
    return p;
  });
  const res = [t, ...ps];
  const s = res.join('\n');
  return s;
};

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
      const types = (0, _rexml.default)('types', xml);
      if (!types.length) throw new Error('XML file should contain root types element.');
      const [{
        content: Types
      }] = types;
      const ts = (0, _rexml.default)('t', Types);
      const s = ts.map(({
        content,
        props: {
          name,
          type,
          desc
        }
      }) => {
        const ps = (0, _rexml.default)('p', content);
        return makeType(name, type, desc, ps);
      });
      const t = s.join('\n *\n');
      const typedef = `/* documentary ${location} */\n${makeBlock(t)}`;
      return typedef;
    } catch (e) {
      LOG('(%s) Could not process typdef-js: %s', location, e.message);
      return match;
    }
  }

};
var _default = typedefRule;
exports.default = _default;
//# sourceMappingURL=typedef-js.js.map