"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.git = exports.gitPush = exports.getStream = exports.read = exports.exactMethodTitle = exports.exactTable = exports.makeARegexFromRule = exports.getLink = void 0;

var _fs = require("fs");

var _spawncommand = _interopRequireDefault(require("spawncommand"));

var _catchment = _interopRequireDefault(require("catchment"));

var _pedantry = _interopRequireDefault(require("pedantry"));

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

const getStream = path => {
  const ls = (0, _fs.lstatSync)(path);
  let stream;

  if (ls.isDirectory()) {
    stream = new _pedantry.default(path);
  } else if (ls.isFile()) {
    stream = (0, _fs.createReadStream)(path);
  }

  return stream;
};

exports.getStream = getStream;

const gitPush = async (source, output, message) => {
  const {
    promise
  } = (0, _spawncommand.default)('git', ['log', '--format=%B', '-n', '1']);
  const {
    stdout
  } = await promise;
  const s = stdout.trim();

  if (s == message) {
    await git('reset', 'HEAD~1');
  }

  await git('add', source, output);
  await git('commit', '-m', message);
  await git('push', '-f');
};

exports.gitPush = gitPush;

const git = async (...args) => {
  const {
    promise
  } = (0, _spawncommand.default)('git', args, {
    stdio: 'inherit'
  });
  await promise;
};

exports.git = git;
//# sourceMappingURL=index.js.map