import { debuglog } from 'util'
import { Replaceable } from 'restream'
import { collect } from 'catchment'
import { typedefMdRe } from './rules/typedef-md'
import { read } from '.'
import { parseFile } from 'typal'
import { codeRe, commentRule } from './rules'
import { methodTitleRe } from './rules/method-title'
import { macroRule, useMacroRule } from './rules/macros'
import competent from 'competent'

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
          // the cache doesn't work so this must be synced
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
      // here don't just push on type name, always push all types
      // const t = typeName ? types.filter(tt => tt.name == typeName) : types

      // always add imports, and if typeName given, add only it, but if not given,
      // add all types.
      const added = types.map(b => {
        const { fullName, import: imp, name } = b
        const f = this.types.find(({ fullName: fn }) => fn == fullName)
        if (f) return
        if (imp) {
          LOG('Adding import %s', fullName)
          this.types.push(b)
          return b
        }
        if (typeName && name == typeName) {
          LOG('Adding type by matched name %s', fullName)
          this.types.push(b)
          return b
        } else if (typeName) {
          return
        }
        LOG('Adding type %s', fullName)
        this.types.push(b)
        return b
      }).filter(Boolean)
      // this.types.push(...types)
      const oldLocationTypes = this.locations[location] || []
      this.locations = {
        ...this.locations,
        [location]: [...oldLocationTypes, ...added],
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
  const c = competent({
    'typedef'({ name, children }) {
      const r = `%TYPEDEF ${children[0]}${name ? ` ${name}` : ''}%`
      return r
    },
  })

  const r = new Replaceable(c)
  stream.pipe(r).pipe(typedefs)

  await collect(typedefs)

  // const { types, locations } = typedefs
  return typedefs
}