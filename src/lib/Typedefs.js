import { debuglog } from 'util'
import { Replaceable } from 'restream'
import { collect } from 'catchment'
import { typedefMdRe } from './rules/typedef-md'
import { read } from '.'
import { parseFile } from 'typal'
import { codeRe, commentRule } from './rules'
import { methodTitleRe } from './rules/method-title'
import { macroRule, useMacroRule } from './rules/macros'

const LOG = debuglog('doc')

/**
 * A Typedefs class will detect and store in a map all type definitions embedded into the documentation.
 */
export default class Typedefs extends Replaceable {
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

export const getTypedefs = async (stream, namespace) => {
  const typedefs = new Typedefs(namespace)
  stream.pipe(typedefs)
  await collect(typedefs)
  const { types, locations } = typedefs
  return { types, locations }
}