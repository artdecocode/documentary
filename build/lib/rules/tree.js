"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _spawncommand = _interopRequireDefault(require("spawncommand"));

var _util = require("util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LOG = (0, _util.debuglog)('doc');
const treeRule = {
  re: /%TREE (.+)%/mg,

  async replacement(match, m) {
    const args = m.split(' ');
    const p = (0, _spawncommand.default)('tree', ['--noreport', ...args]);

    try {
      const {
        stdout
      } = await p.promise;

      if (/\[error opening dir\]/.test(stdout)) {
        LOG('Could not generate a tree for %s', args.join(' '));
        return match;
      }

      return codeSurround(stdout);
    } catch (err) {
      if (err.code == 'ENOENT') {
        console.warn('tree is not installed');
        return match;
      }

      LOG(err.message);
      return match;
    }
  }

};

const codeSurround = (m, lang = 'm') => `\`\`\`${lang}\n${m.trim()}\n\`\`\``;

var _default = treeRule;
exports.default = _default;
//# sourceMappingURL=tree.js.map