"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _spawncommand = require("spawncommand");

// import { debuglog } from 'util'
// const LOG = debuglog('doc')
const forkRule = {
  re: /%FORK(?:-(\w+))? (.+)%/mg,

  async replacement(match, lang, m) {
    const [mod, ...args] = m.split(' ');
    const {
      promise
    } = (0, _spawncommand.fork)(mod, args, {
      execArgv: [],
      stdio: 'pipe'
    });
    const {
      stdout
    } = await promise;
    return codeSurround(stdout, lang);
  }

};

const codeSurround = (m, lang = '') => `\`\`\`${lang}\n${m.trim()}\n\`\`\``;

var _default = forkRule;
exports.default = _default;
//# sourceMappingURL=fork.js.map