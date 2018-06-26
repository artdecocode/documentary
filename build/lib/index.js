"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exactMethodTitle = exports.exactTable = exports.makeARegexFromRule = exports.getLink = void 0;

var _table = _interopRequireDefault(require("./rules/table"));

var _methodTitle = _interopRequireDefault(require("./rules/method-title"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getLink = title => {
  const l = title.replace(/<\/?code>/g, '').replace(/<\/?strong>/g, '').replace(/<br\/>/g, '').replace(/&nbsp;/g, '').replace(/[^\w-\d ]/g, '').toLowerCase().replace(/[, ]/g, '-');
  return l;
};

exports.getLink = getLink;

const makeARegexFromRule = rule => {
  const re = new RegExp(`^${rule.re.source}`);
  return re;
};

exports.makeARegexFromRule = makeARegexFromRule;
const exactTable = makeARegexFromRule(_table.default);
exports.exactTable = exactTable;
const exactMethodTitle = makeARegexFromRule(_methodTitle.default);
exports.exactMethodTitle = exactMethodTitle;
//# sourceMappingURL=index.js.map