let whichStream = require('which-stream'); if (whichStream && whichStream.__esModule) whichStream = whichStream.default;
let Catchment = require('catchment'); if (Catchment && Catchment.__esModule) Catchment = Catchment.default;
let write = require('@wrote/write'); if (write && write.__esModule) write = write.default;
let readDirStructure = require('@wrote/read-dir-structure'); if (readDirStructure && readDirStructure.__esModule) readDirStructure = readDirStructure.default;
const { getToc } = require('../lib/Toc');
const Documentary = require('../lib/Documentary');
const { getStream } = require('../lib');
const { getTypedefs } = require('../lib/Typedefs');
const { join } = require('path');

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
    source, output, reverse, justToc, h1, noCache, rootNamespace, wiki,
  } = options
  let { types: typesLocations } = options

  const stream = getStream(source, reverse, true)

  if (typesLocations) typesLocations = typesLocations.split(',')
  // todo (expired):
  // figure out why can't create a pass-through, pipe into it, pause it then reuse it
  // this is because of highwatermark in the pass-through

  const { types, locations } = await getTypedefs(stream, rootNamespace, typesLocations)

  let assets = []
  if (wiki) {
    const { type, content } = await readDirStructure(source)
    if (type != 'Directory') throw new Error('Please point to the wiki directory.')
    const keys = Object.keys(content).filter((key) => {
      const val = content[key]
      if (val.type == 'Directory' && !key.startsWith('_')) return true
      return /\.(md|html)$/.test(key)
    })
    const docs = await Promise.all(keys.map(async (s) => {
      const val = content[s]
      let o = join(wiki, s)
      if (val.type == 'Directory') o += '.md'
      const so = join(source, s)
      const doc = await runPage({
        ...options,
        locations,
        types,
        wiki,
        output: o,
        source: so,
      })
      return doc
    }))
    assets = [...assets, docs.map(d => d.assets)]
    console.log('Saved %s wiki page%s to %s', docs.length, docs.length > 1 ? 's' : '', wiki)
  } else {
    const doc = await runPage({ source, reverse, locations, types, noCache, h1, justToc, output })
    assets = doc.assets
    if (output) {
      console.log('Saved documentation to %s', output)
    }
  }

  return [...Object.keys(locations), ...assets]
}

const runPage = async (opts) => {
  const {
    source, reverse, locations, types, noCache, h1, justToc,
    output = '-', wiki,
  } = opts

  const stream = getStream(source, reverse, true)
  const doc = new Documentary({
    locations, types, noCache, objectMode: true, wiki, output,
  })
  stream.pipe(doc)
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
    await write(output, result)
  } else {
    console.log(result)
  }
  return doc
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