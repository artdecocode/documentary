"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rexml = _interopRequireDefault(require("rexml"));

var _Property = _interopRequireDefault(require("./Property"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Type {
  fromXML(content, {
    name,
    type,
    desc
  }) {
    if (!name) throw new Error('Type does not have a name.');
    this.name = name;
    if (type) this.type = type;
    if (desc) this.description = desc;

    if (content) {
      const ps = (0, _rexml.default)('p', content);
      const props = ps.map(({
        content: c,
        props: p
      }) => {
        const pr = new _Property.default();
        pr.fromXML(c, p);
        return pr;
      });
      this.properties = props;
    }
  }

  toTypedef() {
    const t = this.type || 'Object'; // ${pd ? ` ${pd}` : ''}

    const d = this.description ? ` ${this.description}` : '';
    const s = ` * @typedef {${t}} ${this.name}${d}`;
    const p = this.properties ? this.properties.map(pr => {
      const sp = pr.toProp();
      return sp;
    }) : [];
    const st = [s, ...p].join('\n');
    return st;
  }

  toParam(paramName) {
    const d = this.description ? ` ${this.description}` : '';
    const s = ` * @param {${this.name}} ${paramName}${d}`;
    const p = this.properties ? this.properties.map(pr => {
      const sp = pr.toParam(paramName);
      return sp;
    }) : [];
    const st = [s, ...p].join('\n');
    return st;
  }

}

var _default = Type;
exports.default = _default;
//# sourceMappingURL=Type.js.map