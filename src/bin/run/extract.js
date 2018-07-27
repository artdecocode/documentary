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
  else if (/^\d+$/. test(val)) v = parseInt(val, 10)
  return v !== undefined ? v : val
}

export const propExtractRe = /^ \* @prop {(.+?)} (\[)?(.+?)(?:=(["'])?(.+?)\4)?(?:])? (.+?)(?: Default `(.+?)`.)?$/gm
const keys = ['type', 'opt', 'name', 'quote', 'defaultValue', 'description', 'Default']

const makeT = (type, name, description, properties) => {
  const hasProps = properties.length
  const tt = type && type != 'Object' ? ` type="${type}"` : ''
  const t = `  <t name="${name}"${tt} desc="${description}"${hasProps ? '' : ' /'}>\n`
  return t
}

const makeP = (type, name, defaultValue, optional, description) => {
  const t = ['string', 'number', 'boolean'].includes(type) ? ` ${type}` : ` type="${type}"`
  const def = defaultValue !== undefined ? ` default="${defaultValue}"` : ''
  const o = optional ? ' opt' : ''
  const desc = description ? `>${description}</p>` : '/>'
  const p = `    <p${o}${t} name="${name}"${def}${desc}\n`
  return p
}

const XML = new Transform({
  transform({ type, name, description, properties }, enc, next) {
    const t = makeT(type, name, description, properties)
    this.push(t)
    properties.forEach(({ type: pType, name: pName, default: d, description: pDesc, optional }) => {
      const p = makeP(pType, pName, d, optional, pDesc)
      this.push(p)
    })
    if (properties.length) this.push('  </t>\n')
    next()
  },
  writableObjectMode: true,
})

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
 * Process a JavaScript file.
 * @param {string} source Path to the source JavaScript file.
 */
export default async function runExtract({
  source,
  extract = '-',
}) {
  try {
    const s = createReadStream(source)
    const ts = createRegexTransformStream(typedefRe)
    const rs = new Transform({
      transform([, type, name, description, props], _, next) {
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
      },
      objectMode: true,
    })

    const stream = new PassThrough()

    await writeOnce(stream, '<types>\n')

    s.pipe(ts).pipe(rs).pipe(XML).pipe(stream, { end: false })

    let p = Promise.resolve()
    if (extract == '-') {
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
      rs.on('error', e => { LOG('Error in RegexTransform'); j(e) })
      ts.on('error', e => { LOG('Error in Transform'); j(e) })
      s.on('error', e => { LOG('Error in Read'); j(e) })
      XML.on('error', e => { LOG('Error in XML'); j(e) })
      stream.on('error', e => { LOG('Error in Stream'); j(e) })
      XML.on('end', r)
    })
    await writeOnce(stream, '</types>\n')
    await p
  } catch (err) {
    catcher(err)
  }
}
