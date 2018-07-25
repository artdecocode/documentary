"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.read = exports.exactMethodTitle = exports.exactTable = exports.makeARegexFromRule = exports.getLink = void 0;

var _table = _interopRequireDefault(require("./rules/table"));

var _methodTitle = _interopRequireDefault(require("./rules/method-title"));

var _fs = require("fs");

var _catchment = _interopRequireDefault(require("catchment"));

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

const read = async source => {
  const rs = (0, _fs.createReadStream)(source);
  const data = await new Promise(async (r, j) => {
    const {
      promise
    } = new _catchment.default({
      rs
    });
    rs.on('error', j);
    const res = await promise;
    r(res);
  });
  return data;
};

exports.read = read;
//# sourceMappingURL=index.js.map