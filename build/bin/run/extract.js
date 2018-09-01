const { createReadStream } = require('fs');
let createRegexTransformStream = require('restream'); if (createRegexTransformStream && createRegexTransformStream.__esModule) createRegexTransformStream = createRegexTransformStream.default;
const { Transform, PassThrough } = require('stream');
let mismatch = require('mismatch'); if (mismatch && mismatch.__esModule) mismatch = mismatch.default;
let whichStream = require('which-stream'); if (whichStream && whichStream.__esModule) whichStream = whichStream.default;
let catcher = require('../catcher'); if (catcher && catcher.__esModule) catcher = catcher.default;
const { debuglog } = require('util');
let typedefRe = require('../../lib/typedef/re'); if (typedefRe && typedefRe.__esModule) typedefRe = typedefRe.default;
const { getNameWithDefault } = require('../../lib/typedef');

const LOG = debuglog('doc')

const getVal = (val) => {
  let v
  if (val == 'true') v = true
  else if (val == 'false') v = false
  else if (/^\d+$/.test(val)) v = parseInt(val, 10)
  return v !== undefined ? v : val
}

       const propExtractRe = /^ \* @prop {(.+?)} (\[)?(.+?)(?:=(["'])?(.+?)\4)?(?:])?(?: (.+?))?(?: Default `(.+?)`.)?$/gm
const keys = ['type', 'opt', 'name', 'quote', 'defaultValue', 'description', 'Default']

const makeType = (type, name, description, properties) => {
  const hasProps = properties.length
  const tt = type && type != 'Object' ? ` type="${type}"` : ''
  const d = description ? ` desc="${description}"` : ''
  const i = ' '.repeat(2)
  const t = `${i}<type name="${name}"${tt}${d}${hasProps ? '' : ' /'}>\n`
  return t
}

const makeP = (type, name, defaultValue, optional, description) => {
  const t = ['string', 'number', 'boolean'].includes(type) ? ` ${type}` : ` type="${type}"`
  const hasDefault = defaultValue !== undefined
  const def = hasDefault ? ` default="${defaultValue}"` : ''
  const o = (optional && !hasDefault) ? ' opt' : ''
  const i = ' '.repeat(4)
  const ii = ' '.repeat(6)
  const desc = description ? `>\n${ii}${description}\n${i}</prop>` : '/>'
  const p = `${i}<prop${o}${t} name="${name}"${def}${desc}\n`
  return p
}

const writeOnce = async (stream, data) => {
  let jj
  await new Promise((r, j) => {
    jj = j
    stream.on('error', jj)
    stream.write(data, r)
  })
  stream.removeListener('error', jj)
}

/**
 * Writes XML.
 */
class XML extends Transform {
  constructor() {
    super({
      writableObjectMode: true,
    })
  }
  _transform({ type, name, description, properties }, enc, next) {
    const t = type && type.startsWith('import')
      ? makeImport(type, name)
      : makeType(type, name, description, properties)
    this.push(t)
    properties.forEach(({ type: pType, name: pName, default: d, description: pDesc, optional }) => {
      const p = makeP(pType, pName, d, optional, pDesc)
      this.push(p)
    })
    if (properties.length) this.push('  </type>\n')
    next()
  }
}

const makeImport = (type, name) => {
  const f = /import\((['"])(.+?)\1\)/.exec(type)
  if (!f) throw new Error(`Could not extract package from "${type}"`)
  const [,, from] = f
  const i = ' '.repeat(2)
  return `${i}<import name="${name}" from="${from}" />\n`
}

/**
 * Parses properties from a RegExp stream.
 */
class Properties extends Transform {
  constructor() {
    super({
      objectMode: true,
    })
  }
  _transform([, type, name, description, props], _, next) {
    /** @type {Object.<string, string>[]} */
    const p = mismatch(
      propExtractRe,
      props,
      keys,
    )
    const properties = p.map(e => {
      const { defaultValue: d, Default: D, opt: o, ...rest } = e
      const pr = {
        ...rest,
        ...(d ? { defaultValue: getVal(d) } : {}),
        ...(D ? { Default: getVal(D) } : {}),
        ...(o ? { optional: true } : {}),
      }
      if (d || D) {
        if (!d) {
          const dn = getNameWithDefault(pr.name, D, pr.type)
          LOG('%s[%s] got from Default.', name, dn)
        } else if (d !== D && pr.Default !== undefined) {
          const dn = getNameWithDefault(pr.name, D, pr.type)
          LOG('%s[%s] does not match Default `%s`.', name, dn, pr.Default)
        }
        pr.default = 'defaultValue' in pr ? pr.defaultValue : pr.Default
        delete pr.defaultValue
        delete pr.Default
      }
      return pr
    })
    const o = {
      type, name, description, properties,
    }
    this.push(o)
    next()
  }
}

/**
 * Process a JavaScript file to extract typedefs and place them in an XML file.
 * @param {Config} config Configuration object.
 * @param {string} config.source Input file from which to extract typedefs.
 * @param {string} [config.destination="-"] Output file to where to write XML. `-` will write to `stdout`. Default `-`.
 * @param {string} [config.stream] An output stream to which to write instead of a location from `extractTo`.
 */
async function extractTypedef(config) {
  const {
    source,
    destination,
    writable,
  } = config
  try {
    const s = createReadStream(source)
    const ts = createRegexTransformStream(typedefRe)
    const ps = new Properties()
    const readable = new PassThrough()
    const xml = new XML()

    await writeOnce(readable, '<types>\n')

    s.pipe(ts).pipe(ps).pipe(xml).pipe(readable, { end: false })

    const p = whichStream({
      readable,
      source,
      writable,
      destination,
    })

    await new Promise((r, j) => {
      s.on('error', e => { LOG('Error in Read'); j(e) })
      ts.on('error', e => { LOG('Error in Transform'); j(e) })
      ps.on('error', e => { LOG('Error in RegexTransform'); j(e) })
      xml.on('error', e => { LOG('Error in XML'); j(e) })
      readable.on('error', e => { LOG('Error in Stream'); j(e) })
      xml.on('end', r)
    })

    await new Promise(r => readable.end('</types>\n', r))
    await p
  } catch (err) {
    catcher(err)
  }
}

/**
 * @typedef {Object} Config Configuration object.
 * @prop {string} [source] Input file from which to extract typedefs.
 * @prop {string} [destination="-"] Output file to where to write XML. `-` will write to `stdout`.
 * @prop {Readable} [stream] An output stream to which to write instead of a location from `extract`.
 */

module.exports=extractTypedef


module.exports.propExtractRe = propExtractRe
//# sourceMappingURL=extract.js.map