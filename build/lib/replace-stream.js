"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createReplaceStream;

var _restream = require("restream");

var _util = require("util");

var _rules = require("./rules");

var _lib = require("../lib");

var _table = _interopRequireDefault(require("./rules/table"));

var _methodTitle = _interopRequireDefault(require("./rules/method-title"));

var _example = _interopRequireDefault(require("./rules/example"));

var _spawncommand = _interopRequireDefault(require("spawncommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LOG = (0, _util.debuglog)('doc');

function createReplaceStream(toc) {
  const tocRule = (0, _rules.createTocRule)(toc);
  const codeBlocks = [];
  const marker = `%%_DOCUMENTARY_REPLACEMENT_${Date.now()}_%%`;
  const s = new _restream.Replaceable([_rules.commentRule, {
    re: new RegExp(_rules.codeRe, 'g'),

    replacement(match) {
      if (_lib.exactTable.test(match) || _lib.exactMethodTitle.test(match)) {
        return match;
      }

      codeBlocks.push(match);
      return marker;
    }

  }, {
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

        return escape(stdout);
      } catch (err) {
        if (err.code == 'ENOENT') {
          console.warn('tree is not installed');
          return match;
        }

        LOG(err.message);
        return match;
      }
    }

  }, tocRule, _rules.badgeRule, _table.default, _methodTitle.default, _example.default, {
    re: new RegExp(marker, 'g'),

    replacement() {
      return codeBlocks.shift();
    }

  }]);
  return s;
}

const escape = m => `\`\`\`m\n${m.trim()}\n\`\`\``;
//# sourceMappingURL=replace-stream.js.map