import argufy from 'argufy'

export const argsConfig = {
  'source': {
    description: 'The documentary file or directory to process.',
    command: true,
  },
  'output': {
    description: 'Where to save the output (e.g., `README.md`).\nIf not passed, prints to `stdout`.',
    short: 'o',
  },
  'toc': {
    description: 'Just print the table of contents.',
    boolean: true,
    short: 't',
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
    boolean: true,
    short: 'n',
  },
  'push': {
    description: 'Starts _Documentary_ in watch mode. After changes are\ndetected, the commit is undone, and new one is made over\nit, forcing git push.',
    boolean: true,
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
 * The documentary file or directory to process.
 */
export const _source = /** @type {string} */ (args['source'])

/**
 * Where to save the output (e.g., `README.md`).
    If not passed, prints to `stdout`.
 */
export const _output = /** @type {string} */ (args['output'])

/**
 * Just print the table of contents.
 */
export const _toc = /** @type {boolean} */ (args['toc'])

/**
 * Print files in reverse order. Useful for blogs.
 */
export const _reverse = /** @type {boolean} */ (args['reverse'])

/**
 * Add `h1` headings to the Table of Contents.
 */
export const _h1 = /** @type {boolean} */ (args['h1'])

/**
 * Watch files for changes and recompile the documentation.
 */
export const _watch = /** @type {boolean} */ (args['watch'])

/**
 * Disable forks' cache for the run. The new output of
    forks will be updated in cache so that it can be used
    next time without `-c` arg.
 */
export const _noCache = /** @type {boolean} */ (args['no-cache'])

/**
 * The root namespace: types within it will not be printed
    with their namespace prefix.
 */
export const _namespace = /** @type {boolean} */ (args['namespace'])

/**
 * Starts _Documentary_ in watch mode. After changes are
    detected, the commit is undone, and new one is made over
    it, forcing git push.
 */
export const _push = /** @type {boolean} */ (args['push'])

/**
 * [Deprecated] Places typedefs definitions into JavaScript
    files from types.xml. Use `typal` instead.
 */
export const _generate = /** @type {boolean} */ (args['generate'])

/**
 * [Deprecated] Migrates existing typedefs from a JavaScript
    file into types.xml. Use `typal -m` instead.
 */
export const _extract = /** @type {boolean} */ (args['extract'])

/**
 * Prints the current version.
 */
export const _version = /** @type {boolean} */ (args['version'])

/**
 * Shows the usage information.
 */
export const _help = /** @type {boolean} */ (args['help'])

/**
 * The additional arguments passed to the program.
 */
export const _argv = /** @type {!Array<string>} */ (args._argv)