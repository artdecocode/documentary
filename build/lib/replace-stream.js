"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createReplaceStream;

var _restream = require("restream");

var _rules = require("./rules");

var _table = _interopRequireWildcard(require("./rules/table"));

var _methodTitle = _interopRequireWildcard(require("./rules/method-title"));

var _tree = _interopRequireDefault(require("./rules/tree"));

var _example = _interopRequireDefault(require("./rules/example"));

var _markers = require("./markers");

var _fork = _interopRequireDefault(require("./rules/fork"));

var _ = require(".");

var _gif = _interopRequireDefault(require("./rules/gif"));

var _type = _interopRequireDefault(require("./rules/type"));

var _badge = _interopRequireDefault(require("./rules/badge"));

var _typedefMd = _interopRequireDefault(require("./rules/typedef-md"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function createReplaceStream(toc) {
  const tocRule = (0, _rules.createTocRule)(toc);
  const {
    table,
    methodTitle,
    code,
    innerCode,
    linkTitle
  } = (0, _markers.makeMarkers)({
    table: _table.tableRe,
    methodTitle: _methodTitle.methodTitleRe,
    code: _rules.codeRe,
    innerCode: _rules.innerCodeRe,
    linkTitle: _rules.linkTitleRe
  });
  /* below have ``` in them, therefore we want more control over handling them
   * so that Replaceable does not confuse them with the code blocks.
   */

  const [cutCode, cutTable, cutMethodTitle, cutInnerCode] = [code, table, methodTitle, innerCode, linkTitle].map(marker => {
    const rule = (0, _markers.makeInitialRule)(marker);
    return rule;
  });
  const [insertCode, insertTable, insertMethodTitle, insertInnerCode] = [code, table, methodTitle, innerCode, linkTitle].map(marker => {
    const rule = (0, _markers.makeRule)(marker);
    return rule;
  });
  const s = new _restream.Replaceable([cutInnerCode, cutTable, cutMethodTitle, cutCode, _rules.commentRule, _badge.default, _tree.default, _example.default, _fork.default, tocRule, _gif.default, _type.default, insertTable, _typedefMd.default, // places a table hence just before table
  _table.default, {
    // a hackish way to update types property tables to include links to seen types.
    re: /\| _(\w+)_ \|/g,

    replacement(match, name) {
      if (!(name in this.types)) return match;
      return `| _[${name}](#${(0, _.getLink)(name)})_ |`;
    }

  }, {
    re: _rules.linkTitleRe,

    replacement(match, title) {
      const ic = new RegExp(innerCode.regExp.source).exec(title); // test please

      let link;

      if (!ic) {
        link = (0, _.getLink)(title);
      } else {
        const [, i] = ic;
        const val = innerCode.map[i];
        link = (0, _.getLink)(val);
      }

      return `<a name="${link}">${title}</a>`;
    }

  }, {
    re: _rules.linkRe,

    // make links
    replacement(match, title) {
      // check why is needed to use innerCode re above
      const link = (0, _.getLink)(title);
      return `<a name="${link}">${title}</a>`;
    }

  }, insertMethodTitle, _methodTitle.default, insertCode, insertInnerCode, // those found inside of code blocks
  insertTable, insertMethodTitle]);
  s.types = {};
  s.on('types', types => {
    types.forEach(type => {
      s.types[type] = true;
    });
  });
  return s;
} // {
//   re: /[\s\S]*/,
//   replacement(match) {
//     debugger
//     return match
//   },
// },
//# sourceMappingURL=replace-stream.js.map