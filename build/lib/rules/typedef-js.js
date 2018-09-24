const { debuglog } = require('util');
let extractTags = require('rexml'); if (extractTags && extractTags.__esModule) extractTags = extractTags.default;
const { read } = require('..');
const { Type } = require('typal');

const LOG = debuglog('doc')

       const typedefJsRe = /^\/\* documentary (.+?) \*\/\n(?:([^\n][\s\S]+?\n))?$/mg


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

      const types = extractTags('type', Root)
      const typedefs = types.map(({ content, props }) => {
        const tt = new Type()
        tt.fromXML(content, props)
        return tt
      })

      this.emit('types', typedefs) // remember types for js-replace-stream

      const ts = typedefs
        .map(tt => tt.toTypedef())

      // imports
      const is = extractTags('import', Root)
        .map(({ props: { name, from } }) => ` * @typedef {import('${from}').${name}} ${name}`)

      const iss = is.join('\n')
      const tss = ts.join('\n *\n')
      const importsAndTypes = `${is.length ? `${iss}\n *\n` : ''}${tss}`

      const b = makeBlock(importsAndTypes)
      const typedef = `/* documentary ${location} */\n${b}`
      return typedef
    } catch (e) {
      LOG('(%s) Could not process typedef-js: %s', location, e.message)
      return match
    }
  },
}

module.exports=typedefRule


module.exports.typedefJsRe = typedefJsRe
//# sourceMappingURL=typedef-js.js.map