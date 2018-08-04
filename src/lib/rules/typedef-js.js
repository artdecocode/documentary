import { debuglog } from 'util'
import extractTags from 'rexml'
import { read } from '..'
import Type from '../typedef/Type'

const LOG = debuglog('doc')

export const typedefJsRe = /^\/\* documentary (.+?) \*\/\n(?:([^\n][\s\S]+?\n))?$/mg


// const makePropsDesc = (props) => {
//   return ''
//   if (!props.length) return ''
//   const l = props.map(({ props: { name, opt } }) => {
//     const n = opt ? `[${name}]` : name
//     return `\`${n}\``
//   })
//   return `Has properties: ${l.join(', ')}.`
// }

const makeBlock = (s) => {
  return `/**
${s}
 */
`
}

/**
 * @typedef {import('restream').AsyncReplacer} AsyncReplacer
 * @type {{re: RegExp, replacement: AsyncReplacer}}
 */
const typedefRule = {
  re: typedefJsRe,
  async replacement(match, location) {
    try {
      LOG('Detected type marker: %s', location)
      const xml = await read(location)
      const root = extractTags('types', xml)
      if (!root.length) throw new Error('XML file should contain root types element.')

      const [{ content: Root }] = root

      const ts = extractTags('t', Root)
      const typedefs = ts.map(({ content, props }) => {
        const tt = new Type()
        tt.fromXML(content, props)
        return tt.toTypedef()
      })
      const t = typedefs.join('\n *\n')

      // imports
      const is = extractTags('i', Root)
        .map(({ props: { name, from } }) => ` * @typedef {import('${from}').${name}} ${name}`)
      const iss = is.join('\n')

      const b = makeBlock(`${is.length ? `${iss}${t ? '\n' : ''}` : ''}${t || ''}`)
      const typedef = `/* documentary ${location} */\n${b}`
      return typedef
    } catch (e) {
      LOG('(%s) Could not process typdef-js: %s', location, e.message)
      return match
    }
  },
}

export default typedefRule
