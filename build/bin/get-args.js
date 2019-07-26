let argufy = require('argufy'); if (argufy && argufy.__esModule) argufy = argufy.default;

const argsConfig = {
  'source': {
    description: 'The documentary file or directory to process.',
    command: true,
    default: 'documentary',
  },
  'output': {
    description: 'Where to save the output (e.g., `README.md`).\nIf not passed, prints to `stdout`.',
    short: 'o',
  },
  'wiki': {
    description: 'Generate documentation in Wiki mode.',
    boolean: true,
    short: 'W',
  },
  'toc': {
    description: 'Just print the table of contents.',
    boolean: true,
    short: 't',
  },
  'types': {
    description: 'The location of types\' files which are not referenced in the documentation (e.g., for printing links to external docs).',
    short: 'T',
  },
  'reverse': {
    description: 'Print files in reverse order. Useful for blogs.',
    boolean: true,
    short: 'r',
  },
  'h1': {
    description: 'Add `h1` headings to the Table of Contents.',
    boolean: true,
    short: 'h1',
  },
  'watch': {
    description: 'Watch files for changes and recompile the documentation.',
    boolean: true,
    short: 'w',
  },
  'no-cache': {
    description: 'Disable forks\' cache for the run. The new output of\nforks will be updated in cache so that it can be used\nnext time without `-c` arg.',
    boolean: true,
    short: 'c',
  },
  'namespace': {
    description: 'The root namespace: types within it will not be printed\nwith their namespace prefix.',
    short: 'n',
  },
  'push': {
    description: 'Starts _Documentary_ in watch mode. After changes are\ndetected, the commit is undone, and new one is made over\nit, forcing git push.',
    short: 'p',
  },
  'generate': {
    description: '[Deprecated] Places typedefs definitions into JavaScript\nfiles from types.xml. Use `typal` instead.',
    boolean: true,
    short: 'g',
  },
  'extract': {
    description: '[Deprecated] Migrates existing typedefs from a JavaScript\nfile into types.xml. Use `typal -m` instead.',
    boolean: true,
    short: 'e',
  },
  'version': {
    description: 'Prints the current version.',
    boolean: true,
    short: 'v',
  },
  'help': {
    description: 'Shows the usage information.',
    boolean: true,
    short: 'h',
  },
}
const args = argufy(argsConfig)

/**
 * The documentary file or directory to process. Default `documentary`.
 */
const _source = /** @type {string} */ (args['source'] || 'documentary')

/**
 * Where to save the output (e.g., `README.md`).
    If not passed, prints to `stdout`.
 */
const _output = /** @type {string} */ (args['output'])

/**
 * Generate documentation in Wiki mode.
 */
const _wiki = /** @type {boolean} */ (args['wiki'])

/**
 * Just print the table of contents.
 */
const _toc = /** @type {boolean} */ (args['toc'])

/**
 * The location of types' files which are not referenced in the documentation (e.g., for printing links to external docs).
 */
const _types = /** @type {string} */ (args['types'])

/**
 * Print files in reverse order. Useful for blogs.
 */
const _reverse = /** @type {boolean} */ (args['reverse'])

/**
 * Add `h1` headings to the Table of Contents.
 */
const _h1 = /** @type {boolean} */ (args['h1'])

/**
 * Watch files for changes and recompile the documentation.
 */
const _watch = /** @type {boolean} */ (args['watch'])

/**
 * Disable forks' cache for the run. The new output of
    forks will be updated in cache so that it can be used
    next time without `-c` arg.
 */
const _noCache = /** @type {boolean} */ (args['no-cache'])

/**
 * The root namespace: types within it will not be printed
    with their namespace prefix.
 */
const _namespace = /** @type {string} */ (args['namespace'])

/**
 * Starts _Documentary_ in watch mode. After changes are
    detected, the commit is undone, and new one is made over
    it, forcing git push.
 */
const _push = /** @type {string} */ (args['push'])

/**
 * [Deprecated] Places typedefs definitions into JavaScript
    files from types.xml. Use `typal` instead.
 */
const _generate = /** @type {boolean} */ (args['generate'])

/**
 * [Deprecated] Migrates existing typedefs from a JavaScript
    file into types.xml. Use `typal -m` instead.
 */
const _extract = /** @type {boolean} */ (args['extract'])

/**
 * Prints the current version.
 */
const _version = /** @type {boolean} */ (args['version'])

/**
 * Shows the usage information.
 */
const _help = /** @type {boolean} */ (args['help'])

/**
 * The additional arguments passed to the program.
 */
const _argv = /** @type {!Array<string>} */ (args._argv)

module.exports.argsConfig = argsConfig
module.exports._source = _source
module.exports._output = _output
module.exports._wiki = _wiki
module.exports._toc = _toc
module.exports._types = _types
module.exports._reverse = _reverse
module.exports._h1 = _h1
module.exports._watch = _watch
module.exports._noCache = _noCache
module.exports._namespace = _namespace
module.exports._push = _push
module.exports._generate = _generate
module.exports._extract = _extract
module.exports._version = _version
module.exports._help = _help
module.exports._argv = _argv