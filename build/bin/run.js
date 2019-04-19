let whichStream = require('which-stream'); if (whichStream && whichStream.__esModule) whichStream = whichStream.default;
let Catchment = require('catchment'); if (Catchment && Catchment.__esModule) Catchment = Catchment.default;
let write = require('@wrote/write'); if (write && write.__esModule) write = write.default;
const { getToc } = require('../lib/Toc');
const Documentary = require('../lib/Documentary');
const { getStream } = require('../lib');
const { getTypedefs } = require('../lib/Typedefs');

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
    source, output = '-', reverse, justToc, h1, noCache, rootNamespace,
  } = options
  const stream = getStream(source, reverse, false)
  // todo: figure out why can't create a pass-through, pipe into it and pause it

  const { types, locations } = await getTypedefs(stream, rootNamespace)

  const stream3 = getStream(source, reverse, true)
  const doc = new Documentary({ locations, types, noCache, objectMode: true })
  stream3.pipe(doc)
  const tocPromise = getToc(doc, h1, locations)

  const c = new Catchment()
  await whichStream({
    readable: doc,
    writable: c,
  })
  const toc = await tocPromise
  const result = (await c.promise)
    .replace('%%_DOCUMENTARY_TOC_CHANGE_LATER_%%', toc)
    .replace(/%%DTOC_(.+?)_(\d+)%%/g, '')

  if (justToc) {
    console.log(toc)
    process.exit()
  }
  if (output != '-') {
    console.log('Saved documentation to %s', output)
    await write(output, result)
  } else {
    console.log(result)
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