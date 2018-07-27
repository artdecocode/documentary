import { createWriteStream, createReadStream } from 'fs'
import createRegexTransformStream from 'restream'
import { Transform, PassThrough } from 'stream'
import mismatch from 'mismatch'
import catcher from '../catcher'
import { debuglog } from 'util'
import typedefRe from '../../lib/typedef/re'
import { getNameWithDefault } from '../../lib/typedef'

const LOG = debuglog('doc')

const getVal = (val) => {
  let v
  if (val == 'true') v = true
  else if (val == 'false') v = false
  else if (/^\d+$/.test(val)) v = parseInt(val, 10)
  return v !== undefined ? v : val
}

export const propExtractRe = /^ \* @prop {(.+?)} (\[)?(.+?)(?:=(["'])?(.+?)\4)?(?:])? (.+?)(?: Default `(.+?)`.)?$/gm
const keys = ['type', 'opt', 'name', 'quote', 'defaultValue', 'description', 'Default']

const makeT = (type, name, description, properties) => {
  const hasProps = properties.length
  const tt = type && type != 'Object' ? ` type="${type}"` : ''
  const d = description ? ` desc="${description}"` : ''
  const i = ' '.repeat(2)
  const t = `${i}<t name="${name}"${tt}${d}${hasProps ? '' : ' /'}>\n`
  return t
}

const makeP = (type, name, defaultValue, optional, description) => {
  const t = ['string', 'number', 'boolean'].includes(type) ? ` ${type}` : ` type="${type}"`
  const def = defaultValue !== undefined ? ` default="${defaultValue}"` : ''
  const o = optional ? ' opt' : ''
  const desc = description ? `>${description}</p>` : '/>'
  const i = ' '.repeat(4)
  const p = `${i}<p${o}${t} name="${name}"${def}${desc}\n`
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
    const t = makeT(type, name, description, properties)
    this.push(t)
    properties.forEach(({ type: pType, name: pName, default: d, description: pDesc, optional }) => {
      const p = makeP(pType, pName, d, optional, pDesc)
      this.push(p)
    })
    if (properties.length) this.push('  </t>\n')
    next()
  }
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
        }
        else if (d != D) {
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
 * @param {string} [config.extract="-"] Output file to where to write XML. `-` will write to `stdout`.
 * @param {string} [config.stream] An output stream to which to write instead of a location from `extract`.
 */
async function runExtract(config) {
  const {
    source,
    extract = '-',
    stream: st,
  } = config
  try {
    const s = createReadStream(source)
    const ts = createRegexTransformStream(typedefRe)
    const ps = new Properties()
    const stream = new PassThrough()
    const xml = new XML()

    await writeOnce(stream, '<types>\n')

    s.pipe(ts).pipe(ps).pipe(xml).pipe(stream, { end: false })

    let p = Promise.resolve()
    if (st) {
      stream.pipe(st)
    } else if (extract == '-') {
      stream.pipe(process.stdout)
    } else {
      const ws = createWriteStream(extract)
      p = new Promise((r, j) => {
        ws.on('close', r)
        ws.on('error', j)
      })
      stream.pipe(ws)
    }

    await new Promise((r, j) => {
      s.on('error', e => { LOG('Error in Read'); j(e) })
      ts.on('error', e => { LOG('Error in Transform'); j(e) })
      ps.on('error', e => { LOG('Error in RegexTransform'); j(e) })
      xml.on('error', e => { LOG('Error in XML'); j(e) })
      stream.on('error', e => { LOG('Error in Stream'); j(e) })
      xml.on('end', r)
    })

    await new Promise(r => stream.end('</types>\n', r))
    await p
  } catch (err) {
    catcher(err)
  }
}

/**
 * @typedef {Object} Config Configuration object.
 * @prop {string} [source] Input file from which to extract typedefs.
 * @prop {string} [extract="-"] Output file to where to write XML. `-` will write to `stdout`.
 * @prop {Readable} [stream] An output stream to which to write instead of a location from `extract`.
 */

export default runExtract
