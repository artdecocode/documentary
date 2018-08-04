import { debuglog } from 'util'
import extractTags from 'rexml'
import { read, getLink } from '..'
import { getPropType } from '../typedef'

const LOG = debuglog('doc')

export const typedefMdRe = /^%TYPEDEF (.+?)(?: (.+?))?%$/mg

const getLinkToType = (allTypes, type) => {
  const linkType = allTypes.find(({ props: { name: n } }) => n == type)
  const link = linkType ? getLink(linkType.props.name) : undefined
  return link
}

const makeTable = (props, allTypes = []) => {
  const h = ['Name', 'Type', 'Description', 'Default']
  const ps = props.map(({ content, props: { name, opt, default: defaultVal, ...propType } }) => {
    const type = getPropType(propType)
    const link = getLinkToType(allTypes, type)
    const t = `_${type}_`
    const tt = link ? `[${t}](#${link})` : t
    const n = opt ? name : `__${name}*__`
    const d = defaultVal === undefined ? '-' : `\`${defaultVal}\``
    return [n, tt, content, d]
  })
  const res = [h, ...ps]
  return JSON.stringify(res)
}

const getTypeDef = ({ content, props: { desc, name, type, noToc } }, allTypes = []) => {
  const props = extractTags('p', content)
  const t = type ? `\`${type}\` ` : ''
  const n = `\`${name}\``
  const nn = noToc ? n : `[${n}](t)`
  const line = `${t}__${nn}__${desc ? `: ${desc}` : ''}`
  const table = makeTable(props, allTypes)
  const tb = props.length ? `\`\`\`table
${table}
\`\`\`` : ''
  const res = `${line}

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

      if (typeName) return getSingle(ts, typeName)
      return getMultiple(ts)
    } catch (e) {
      LOG('(%s) Could not process typdef-js: %s', location, e.message)
      return match
    }
  },
}

const getMultiple = (ts) => {
  const types = ts.map((type) => {
    const t = getTypeDef(type, ts)
    return t.trim()
  })
  const res = types.join('\n\n')
  return res
}

const getSingle = (ts, typeName) => {
  const type = ts.find(({ props: { name } }) => name == typeName)
  if (!type) throw new Error(`Could not find the type ${typeName}`)

  const res = getTypeDef(type)
  return res
}

export default typedefMdRule
