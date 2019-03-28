let argufy = require('argufy'); if (argufy && argufy.__esModule) argufy = argufy.default;

const args = argufy({
  'source': { command: true },
  'toc': { short: 't', boolean: true },
  'reverse': { short: 'r', boolean: true,
    description: 'Print files in reverse order. Useful for blogs.',
  },
  'h1': { short: 'h1', boolean: true,
    description: 'Process h1 headings',
  },
  'watch': { short: 'w', boolean: true },
  'output': 'o',
  'no-cache': { short: 'c', boolean: true },
  'push': { short: 'p' },
  'generate': { short: 'g',
    description: 'Process a JavaScript file to include typedef documentation in their source code. The target file should contain `/* documentary path/to/types.xml */` marker in place where types are to be inserted.',
  },
  'version': { short: 'v', boolean: true },
  'extract': { short: 'e',
    description: 'Extract @typedef JSDoc comments and place them in a file.',
  },
})

/**
 * The entry file to compile.
 * @type {string}
 */
       const _source = args['source']

/**
 * Only generate the table of contents.
 * @type {boolean}
 */
       const _toc = args['toc']

/**
 * Compile documentation in reverse order.
 * @type {boolean}
 */
       const _reverse = args['reverse']

/**
 * Process h1 headings.
 * @type {boolean}
 */
       const _h1 = args['h1']

/**
 * Watch for changes.
 * @type {boolean}
 */
       const _watch = args['watch']

/**
 * The output README file.
 * @type {string}
 */
       const _output = args['output']

/**
 * Push changes to GitHub after each change.
 * @type {boolean}
 * @todo Update examples and other files referenced in the code.
 */
       const _push = args['push']

/**
 * Generate the JSDoc documentation of types.
 * @type {boolean}
 */
       const _generate = args['generate']

/**
 * Print the version information and quit.
 * @type {boolean}
 */
       const _version = args['version']

/**
 * Extract types from a JS file and place them into types.xml (for migration).
 * @type {boolean}
 */
       const _extract = args['extract']

/**
 * Disable cache.
 * @type {boolean}
 */
       const _noCache = args['no-cache']

/**
 * Any additional arguments.
 * @type {Array<string>}
 */
       const _argv = args._argv

module.exports._source = _source
module.exports._toc = _toc
module.exports._reverse = _reverse
module.exports._h1 = _h1
module.exports._watch = _watch
module.exports._output = _output
module.exports._push = _push
module.exports._generate = _generate
module.exports._version = _version
module.exports._extract = _extract
module.exports._noCache = _noCache
module.exports._argv = _argv