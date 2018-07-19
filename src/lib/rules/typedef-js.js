import { debuglog } from 'util'
import extractTags from 'rexml'
import { read } from '..'

const LOG = debuglog('doc')

export const typedefJsRe = /^\/\* documentary (.+?) \*\/\n([\s\S]+?\n)?\n$/mg

const makeProp = (name, opt, type = '*', defaultValue, desc = '') => {
  if (!name) throw new Error('Property does not have a value.')
  const hasDefault = defaultValue !== undefined
  const n = hasDefault ? `${name}="${defaultValue}"` : name
  const nn = opt ? `[${n}]` : n
  const d = hasDefault ? ` Default \`${defaultValue}\`.` : ''
  const p = ` * @prop {${type}} ${nn} ${desc}${d}`
  return p
}

const getPropType = ({ number, string, boolean, type }) => {
  if (string) return 'string'
  if (number) return 'number'
  if (boolean) return 'boolean'
  if (type) return type
  return 'any'
}

const makeType = (name, type = 'Object', desc = '', props) => {
  if (!name) throw new Error('Type does not have a name.')
  const t = ` * @typedef {${type}} ${name}${desc ? ` ${desc}` : desc}`
  const ps = props.map(({ content, props: { name: propName, opt, default: defaultVal, ...propType } }) => {
    const pt = getPropType(propType)
    const p = makeProp(propName, opt, pt, defaultVal, content)
    return p
  })
  const res = [t, ...ps]
  const s = res.join('\n')
  return s
}

const makeBlock = (s) => {
  return `/**
${s}
 */`
}

/**
 * @typedef {import('restream').AsyncReplacer} AsyncReplacer
 * @type {{re: RegExp, replacement: AsyncReplacer}}
 */
const typedefRule = {
  re: typedefJsRe,
  async replacement(match, location) {
    try {
      // debugger
      const xml = await read(location)
      // console.log(xml)
      const types = extractTags('types', xml)
      if (!types.length) throw new Error('XML file should contain root types element.')

      const [{ content: Types }] = types

      const ts = extractTags('t', Types)
      const s = ts.map(({ content, props: { name, type, desc } }) => {
        const ps = extractTags('p', content)
        return makeType(name, type, desc, ps)
      })
      const t = s.join('\n')
      const typedef = makeBlock(t)
      return typedef
    } catch (e) {
      LOG('(%s) Could not process typdef-js: %s', location, e.message)
      return match
    }
  },
}

export default typedefRule