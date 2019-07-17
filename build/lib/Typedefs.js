const { debuglog } = require('util');
const { Replaceable } = require('restream');
const { collect } = require('catchment');
const { typedefMdRe } = require('./rules/typedef-md');
const { read } = require('.');
const { parseFile } = require('typal');
const { codeRe, commentRule } = require('./rules');
const { methodTitleRe } = require('./rules/method-title');
const { macroRule, useMacroRule } = require('./rules/macros');

const LOG = debuglog('doc')

/**
 * A Typedefs class will detect and store in a map all type definitions embedded into the documentation.
 */
class Typedefs extends Replaceable {
  constructor(rootNamespace) {
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
      macroRule,
      useMacroRule,
      {
        re: typedefMdRe,
        async replacement(match, location, typeName) {
          if (this.hasCache(location, typeName)) return
          this.addCache(location,typeName)
          try {
            const xml = await read(location)
            const { types, Imports } = parseFile(xml, rootNamespace)

            this.emit('types', {
              location,
              types: [...Imports, ...types],
              typeName,
            })
          } catch (e) {
            LOG('(%s) Could not process typedef-md: %s', location, e.message)
            LOG(e.stack)
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
    this.cache = {}
  }
  addCache(location, typename = '') {
    this.cache[`${location}::${typename}`] = 1
  }
  hasCache(location, typename = '') {
    return this.cache[`${location}::${typename}`]
  }
}

// {
//   re: /[\s\S]+/g,
//   replacement(match) {
//     debugger
//     return match
//   },
// },

const getTypedefs = async (stream, namespace) => {
  const typedefs = new Typedefs(namespace)
  stream.pipe(typedefs)
  await collect(typedefs)
  const { types, locations } = typedefs
  return { types, locations }
}

module.exports = Typedefs
module.exports.getTypedefs = getTypedefs