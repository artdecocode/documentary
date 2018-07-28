"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _argufy = _interopRequireDefault(require("argufy"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getArgs = () => {
  return (0, _argufy.default)({
    source: {
      command: true
    },
    toc: {
      short: 't',
      boolean: true
    },
    watch: {
      short: 'w',
      boolean: true
    },
    output: 'o',
    push: {
      short: 'p'
    },
    generate: {
      short: 'g',
      description: 'Process a JavaScript file to include typedef documentation in their source code. The target file should contain `/* documentary path/to/types.xml */` marker in place where types are to be inserted.'
    },
    version: {
      short: 'v',
      boolean: true
    },
    extract: {
      short: 'e',
      description: 'Extract @typedef JSDoc comments and place them in a file.'
    }
  });
};

var _default = getArgs;
exports.default = _default;
//# sourceMappingURL=get-args.js.map