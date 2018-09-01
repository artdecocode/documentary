const { debuglog } = require('util');
let extractTags = require('rexml'); if (extractTags && extractTags.__esModule) extractTags = extractTags.default;
const { read } = require('..');
let Type = require('../typedef/Type'); if (Type && Type.__esModule) Type = Type.default;

const LOG = debuglog('doc')

       const typedefMdRe = /^%TYPEDEF (.+?)(?: (.+?))?%$/mg

/**
 * This rule is used to used to parse a typedefs XML file and place the definition of a type into documentation.
 * @todo Cache extracted types from XML files.
 * @type {{re: RegExp, replacement: AsyncReplacer}}
 */
const typedefMdRule = {
  re: typedefMdRe,
  async replacement(match, location, typeName) {
    try {
      const xml = await read(location)
      const root = extractTags('types', xml)
      if (!root.length) throw new Error('XML file should contain root types element.')

      const [{ content: Root }] = root
      const types = extractTags('type', Root)
      const typedefs = types
        .map(({ content, props }) => {
          const type = new Type()
          type.fromXML(content, props)
          return type
        })

      const imports = extractTags('import', Root)
        .map(({ props: { name, from, desc } }) => {
          const type = new Type()
          type.fromXML('', {
            name,
            type: `import('${from}').${name}`,
            noToc: true,
            import: true,
            desc,
          })
          return type
        })

      const ft = [...imports, ...typedefs]
        .filter(({ name }) => {
          if (typeName) return name == typeName
          return true
        })

      this.emit('types', ft.map(({ name }) => name))

      if (typeName && !ft.length) throw new Error(`Type ${typeName} not found.`)

      const mdt = ft
        .map((type, _, a) => {
          return type.toMarkdown(a)
        })

      return mdt.join('\n\n')
    } catch (e) {
      LOG('(%s) Could not process typedef-md: %s', location, e.message)
      return match
    }
  },
}

/**
 * @typedef {import('restream').AsyncReplacer} AsyncReplacer
 */

module.exports=typedefMdRule


module.exports.typedefMdRe = typedefMdRe
//# sourceMappingURL=typedef-md.js.map