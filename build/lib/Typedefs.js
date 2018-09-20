const { debuglog } = require('util');
const { Replaceable } = require('restream');
let extractTags = require('rexml'); if (extractTags && extractTags.__esModule) extractTags = extractTags.default;
const { collect } = require('catchment');
const { typedefMdRe } = require('./rules/typedef-md');
const { read } = require('.');
let Type = require('./typedef/Type'); if (Type && Type.__esModule) Type = Type.default;
const { codeRe, commentRule } = require('./rules');
const { methodTitleRe } = require('./rules/method-title');

const LOG = debuglog('doc')

/**
 * A Typedefs class will detect and store in a map all type definitions embedded into the documentation.
 */
               class Typedefs extends Replaceable {
  constructor() {
    super([
      {
        re: methodTitleRe,
        replacement() {
          return ''
        },
      },
      {
        re: codeRe,
        replacement() {
          return ''
        },
      },
      commentRule,
      {
        re: typedefMdRe,
        async replacement(match, location, typeName) {
          if (location in this.locations) return
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
              .map(({ props: { name, from, desc, link } }) => {
                const type = new Type()
                type.fromXML('', {
                  name,
                  type: `import('${from}').${name}`,
                  noToc: true,
                  import: true,
                  desc,
                  link,
                })
                return type
              })
            this.emit('types', {
              location,
              types: [...imports, ...typedefs],
              typeName,
            })
          } catch (e) {
            LOG('(%s) Could not process typedef-md: %s', location, e.message)
          }
        },
      },
    ])
    this.types = []
    this.locations = {}
    this.on('types', ({ location, types, typeName }) => {
      const t = typeName ? types.filter(tt => tt.name == typeName) : types
      this.types.push(...t)
      const oldLocationTypes = this.locations[location] || []
      this.locations = {
        ...this.locations,
        [location]: [...oldLocationTypes, ...t],
      }
    })
  }
}

// {
//   re: /[\s\S]+/g,
//   replacement(match) {
//     debugger
//     return match
//   },
// },

       const getTypedefs = async (stream) => {
  const typedefs = new Typedefs()
  stream.pipe(typedefs)
  await collect(typedefs)
  const { types, locations } = typedefs
  return { types, locations }
}

module.exports = Typedefs
module.exports.getTypedefs = getTypedefs
//# sourceMappingURL=Typedefs.js.map