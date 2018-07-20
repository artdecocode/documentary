import { debuglog } from 'util'
import extractTags from 'rexml'
import { read } from '..'
import { getPropType } from './typedef-js';

const LOG = debuglog('doc')

export const typedefMdRe = /^%TYPEDEF (.+?) (.+?)%$/mg

const makeTable = (props) => {
  const h = ['Name', 'Type', 'Description', 'Default']
  const ps = props.map(({ content, props: { name, opt, default: defaultVal, ...propType } }) => {
    const type = getPropType(propType)
    const t = `_${type}_`
    const n = opt ? name : `__${name}*__`
    const d = defaultVal === undefined ? '-' : `\`${defaultVal}\``
    return [n, t, content, d]
  })
  const res = [h, ...ps]
  return JSON.stringify(res)
}

const getTypeDef = ({ content, props: { desc, name } }) => {
  const props = extractTags('p', content)
  const t = `[\`${name}\`](t): ${desc}`
  const table = makeTable(props)
  const tb = `\`\`\`table
${table}
\`\`\``
  const res = `${t}

${tb}`
  return res
}

/**
 * @typedef {import('restream').AsyncReplacer} AsyncReplacer
 * @type {{re: RegExp, replacement: AsyncReplacer}}
 */
const typedefMdRule = {
  re: typedefMdRe,
  async replacement(match, location, typeName) {
    try {
      const xml = await read(location)
      const types = extractTags('types', xml)
      if (!types.length) throw new Error('XML file should contain root types element.')

      const [{ content: Types }] = types
      const ts = extractTags('t', Types)

      const type = ts.find(({ props: { name } }) => name == typeName)
      if (!type) throw new Error(`Could not find the type ${typeName}`)

      const res = getTypeDef(type)
      return res
    } catch (e) {
      LOG('(%s) Could not process typdef-js: %s', location, e.message)
      return match
    }
  },
}

export default typedefMdRule
