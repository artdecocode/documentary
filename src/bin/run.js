import whichStream from 'which-stream'
import Catchment from 'catchment'
import write from '@wrote/write'
import readDirStructure from '@wrote/read-dir-structure'
import { getToc } from '../lib/Toc'
import Documentary from '../lib/Documentary'
import { getStream } from '../lib'
import { getTypedefs } from '../lib/Typedefs'
import { join } from 'path'
import Stream from 'stream'

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
export default async function run(options) {
  const {
    source, output, reverse, justToc, h1, noCache, rootNamespace, wiki,
  } = options

  let { types: typesLocations, focus } = options
  if (focus) focus = focus.split(',')

  const stream = getStream(source, reverse, true)

  if (typesLocations) typesLocations = typesLocations.split(',')
  // todo (expired):
  // figure out why can't create a pass-through, pipe into it, pause it then reuse it
  // this is because of highwatermark in the pass-through

  const { types, locations } = await getTypedefs(stream, rootNamespace, typesLocations, {
    wiki, source,
  })

  let assets = []
  if (wiki) {
    const { type, content } = await readDirStructure(source)
    if (type != 'Directory') throw new Error('Please point to the wiki directory.')
    const keys = Object.keys(content).filter((key) => {
      const val = content[key]
      if (focus) {
        return focus.includes(key)
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
    locations, types, noCache, objectMode: true, wiki, output, source,
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
