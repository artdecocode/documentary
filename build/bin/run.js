let whichStream = require('which-stream'); if (whichStream && whichStream.__esModule) whichStream = whichStream.default;
const { getToc } = require('../lib/Toc');
let Documentary = require('../lib/Documentary'); if (Documentary && Documentary.__esModule) Documentary = Documentary.default;
const { getStream } = require('../lib');

/**
 * Run the documentary and save the results.
 * @param {RunOptions} options Options for the run command.
 * @param {string} options.source The path to the source directory or file.
 * @param {string} [options.output="-"] The path where to save the output. When `-` is passed, prints to `stdout`. Default `-`.
 * @param {boolean} [options.reverse=false] Read files in directories in reverse order, such that `30.md` comes before `1.md`. Useful for blogs. Default `false`.
 * @param {boolean} [options.justToc=false] Only print the table of contents and exit. Default `false`.
 * @param {boolean} [options.h1=false] Include `H1` headers in the table of contents. Default `false`.
 */
               async function run(options) {
  const {
    source, output = '-', reverse, justToc, h1,
  } = options
  // run the whole stream once to get the toc first
  // TODO: get all methods here as well
  const stream = getStream(source, reverse)
  // we used to create a pass through, pause and pipe stream in it,
  // but there were problems.
  const toc = await getToc(stream, h1)
  if (justToc) {
    console.log(toc)
    process.exit()
  }

  const stream2 = getStream(source, reverse)
  const doc = new Documentary({ toc })
  stream2.pipe(doc)
  await whichStream({
    readable: doc,
    destination: output,
  })
  if (output != '-') {
    console.log('Saved documentation to %s', output)
  }
}

/* documentary types/run.xml */
/**
 * @typedef {Object} RunOptions Options for the run command.
 * @prop {string} source The path to the source directory or file.
 * @prop {string} [output="-"] The path where to save the output. When `-` is passed, prints to `stdout`. Default `-`.
 * @prop {boolean} [reverse=false] Read files in directories in reverse order, such that `30.md` comes before `1.md`. Useful for blogs. Default `false`.
 * @prop {boolean} [justToc=false] Only print the table of contents and exit. Default `false`.
 * @prop {boolean} [h1=false] Include `H1` headers in the table of contents. Default `false`.
 */


module.exports = run
//# sourceMappingURL=run.js.map