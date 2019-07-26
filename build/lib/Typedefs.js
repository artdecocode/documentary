const { debuglog } = require('util');
const { Replaceable } = require('restream');
const { collect } = require('catchment');
const { typedefMdRe } = require('./rules/typedef-md');
const { read } = require('.');
const { parseFile } = require('typal');
const { codeRe, commentRule } = require('./rules');
const { methodTitleRe } = require('./rules/method-title');
const { macroRule, useMacroRule } = require('./rules/macros');
let competent = require('competent'); if (competent && competent.__esModule) competent = competent.default;
const { Transform } = require('stream');

const LOG = debuglog('doc')

const nodeAPI = {
  'http.IncomingMessage': {
    link: 'https://nodejs.org/api/http.html#http_class_http_incomingmessage',
    desc: 'A readable stream that receives data from the client in chunks. The first argument of the http.Server.on("request") event.',
  },
  'http.ServerResponse': {
    // link: 'https://nodejs.org/api/http.html#http_response_socket',
    link: 'https://nodejs.org/api/http.html#http_class_http_serverresponse',
    desc: 'A writable stream that communicates data to the client. The second argument of the http.Server.on("request") event.',
  },
  'url.URL': {
    link: 'https://nodejs.org/api/url.html#url_class_url',
    desc: 'Browser-compatible URL class, implemented by following the `WHATWG` URL Standard.',
  },
  'net.Socket': {
    link: 'https://nodejs.org/api/net.html#net_class_net_socket',
    desc: 'A two-way communication channel between clients and servers.',
  },
  'stream.Stream': {
    link: 'https://nodejs.org/api/stream.html#stream',
    desc: 'Handles streaming data in Node.js.',
  },
  'events.EventEmitter': {
    link: 'https://nodejs.org/api/events.html#events_class_eventemitter',
    desc: 'Emits named events that cause listeners to be called.',
  },
}

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
          const file = this.file // read early before async

          // the cache doesn't work so this must be synced
          if (this.hasCache(location, typeName)) return
          this.addCache(location, typeName)
          try {
            const xml = await read(location)
            const { types, Imports } = parseFile(xml, rootNamespace)

            this.emit('types', {
              location,
              types: [...Imports, ...types],
              typeName,
              file,
            })
          } catch (e) {
            LOG('(%s) Could not process typedef-md: %s', location, e.message)
            LOG(e.stack)
          }
        },
      },
    ], { objectMode: true })
    /** @type {!Array<import('typal/src').Type>} */
    this.types = []
    this.locations = {}
    this.on('types', ({ location, types, typeName, file }) => {
      // here don't just push on type name, always push all types
      // const t = typeName ? types.filter(tt => tt.name == typeName) : types

      // always add imports, and if typeName given, add only it, but if not given,
      // add all types.
      const added = types.map(b => {
        const { fullName, import: imp, name } = b
        const f = this.types.find(({ fullName: fn, import: i }) => {
          return (fn == fullName) && (i == imp)
        })
        if (f) {
          f.appearsIn = f.appearsIn || []
          if (!f.appearsIn.includes(file)) {
            f.appearsIn.push(file)
          }
          return
        }
        b.appearsIn = [file]
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
    this.file = null
  }
  addCache(location, typename = '') {
    this.cache[`${location}::${typename}`] = 1
  }
  hasCache(location, typename = '') {
    return this.cache[`${location}::${typename}`]
  }
  async _transform(chunk, _, next) {
    if (typeof chunk == 'object') {
      this.file = chunk.file
      await super._transform(chunk.data, _, next)
    } else {
      await super._transform(chunk, _, next)
    }
  }
}

// {
//   re: /[\s\S]+/g,
//   replacement(match) {
//     debugger
//     return match
//   },
// },

/**
 * Returns a complete instance of typedefs, which has types and locations properties.
 */
const getTypedefs = async (stream, namespace, typesLocations = []) => {
  const typedefs = new Typedefs(namespace)
  typesLocations.forEach((location) => {
    typedefs.write(`%TYPEDEF ${location}%\n`)
  })
  const c = competent({
    'typedef'({ name, children }) {
      const r = `%TYPEDEF ${children[0]}${name ? ` ${name}` : ''}%`
      return r
    },
  })

  // const r = new Replaceable(c)
  stream.pipe(new Transform({
    async transform({ data, file }, enc, next) {
      if (data == 'separator' || !data.trim()) return next()
      if (!/\.(md|html)$/.test(file)) return next()

      const d = await Replaceable.replace(new Replaceable(c), data)
      this.push({ data: d, file })
      next()
    },
    objectMode: true,
  })).pipe(typedefs)

  await collect(typedefs)

  const { types } = typedefs

  // hack descriptions
  types.forEach((type) => {
    // find descriptions from imports within same types
    if (type.import && !type.description) {
      const realType = types.find(t2 => {
        return !t2.import && t2.fullName == type.fullName
      })
      if (realType) type.description = realType.description
    }

    if (type.import) {
      const api = nodeAPI[type.fullName]
      if (api) {
        if (!type.link) type.link = api.link
        if (!type.description) type.description = api.desc
      }
    }
  })

  // const { types, locations } = typedefs
  return typedefs
}

module.exports = Typedefs
module.exports.getTypedefs = getTypedefs