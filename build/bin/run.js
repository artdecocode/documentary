const { whichStream } = require('../../stdlib');
const { Catchment } = require('../../stdlib');
const { write } = require('../../stdlib');
const { readDirStructure } = require('../../stdlib');
const { join } = require('path');
const Stream = require('stream');
const { getToc } = require('../lib/Toc');
const Documentary = require('../lib/Documentary');
const { getStream, getLink } = require('../lib');
const { getTypedefs } = require('../lib/Typedefs');
const Annotate = require('./annotate');

/**
 * Run the documentary and save the results.
 * @param {RunOptions} options Options for the run command.
 * @param {string} options.source The path to the source directory or file.
 * @param {string} [options.output="-"] The path where to save the output. When `-` is passed, prints to `stdout`. Default `-`.
 * @param {boolean} [options.reverse=false] Read files in directories in reverse order, such that `30.md` comes before `1.md`. Useful for blogs. Default `false`.
 * @param {boolean} [options.justToc=false] Only print the table of contents and exit. Default `false`.
 * @param {boolean} [options.h1=false] Include `H1` headers in the table of contents. Default `false`.
 * @param {boolean} [options.noCache=false] Disable caching. Default `false`.
 * @param {boolean} [options.rootNamespace=false] Forces dropping of this namespace for types. Default `false`.
 * @param {string} [options.wiki] Generates multiple wiki pages in this directory.
 */
async function run(options) {
  const {
    source, output, reverse, justToc, h1, noCache, rootNamespace, wiki,
    annotate,
  } = options

  let { types: typesLocations, focus } = options
  if (focus) focus = focus.split(',').map(f => new RegExp(f)) //

  const stream = getStream(source, reverse, true)

  if (typesLocations) typesLocations = typesLocations.split(',')
  // todo (expired):
  // figure out why can't create a pass-through, pipe into it, pause it then reuse it
  // this is because of highwatermark in the pass-through

  const typedefs = await getTypedefs(stream, rootNamespace, typesLocations, {
    wiki, source, recordOriginalNs: annotate,
  })

  if (annotate) Annotate(wiki, typedefs.types)

  let assets = []
  let _annotatedTypes = []
  if (wiki) {
    const { type, content } = await readDirStructure(source)
    if (type != 'Directory') throw new Error('Please point to the wiki directory.')
    const keys = Object.keys(content).filter((key) => {
      const val = content[key]
      if (focus) {
        return focus.some(f => f.test(key))
      }
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
        typedefs,
        wiki,
        output: o,
        source: so,
      })
      assets = [...assets, ...doc.assets]
      _annotatedTypes = [..._annotatedTypes, ...doc._annotatedTypes]
      return doc
    }))
    console.log('Saved %s wiki page%s to %s', docs.length, docs.length > 1 ? 's' : '', wiki)
  } else {
    const doc = await runPage({ source, reverse, typedefs, noCache, h1, justToc, output })
    assets = doc.assets
    _annotatedTypes = doc._annotatedTypes
    if (output) {
      console.log('Saved documentation to %s', output)
    }
  }

  if (annotate) {
    const at = _annotatedTypes.map(({ type, sig, currentFile }) => {
      sig = sig.replace(/^#+ +/, '')
      const { name, description, originalNs } = type
      return { name, description, originalNs, sig, appearsIn: [currentFile] }
    })
    Annotate(wiki, at, (type) => {
      return getLink(type.sig)
    })
  }

  return [...Object.keys(typedefs.locations), ...assets]
}

/**
 * @param {Object} opts
 * @param {import('../lib/Typedefs').default} opts.typedefs
 */
const runPage = async (opts) => {
  const {
    source, reverse, locations, typedefs, noCache, h1, justToc,
    output = '-', wiki,
  } = opts

  const stream = getStream(source, reverse, true)
  const doc = new Documentary({
    locations, typedefs, noCache, objectMode: true, wiki, output, source,
    cacheLocation: process.env.DOCUMENTARY_CACHE_LOCATION,
  })
  stream.pipe(doc)
  const tocPromise = getToc(doc, h1, locations, justToc)

  const c = new Catchment()
  await whichStream({
    readable: doc,
    writable: c,
  })
  const toc = await tocPromise

  if (justToc) { // can also write toc to the output
    console.log(toc)
    return
  }
  const result = (await c.promise)
    .replace('%%_DOCUMENTARY_TOC_CHANGE_LATER_%%', toc)
    .replace(/%%DTOC_(.+?)_(\d+)%%/g, '')

  if (output instanceof Stream) {
    await new Promise((r, j) => {
      output.on('error', j)
      output.end(result, r)
    })
  } else if (output != '-') {
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
 * @prop {boolean} [noCache=false] Disable caching. Default `false`.
 * @prop {boolean} [rootNamespace=false] Forces dropping of this namespace for types. Default `false`.
 * @prop {string} [wiki] Generates multiple wiki pages in this directory.
 */


module.exports = run