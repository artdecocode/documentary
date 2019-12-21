const { Replaceable, replace } = require('../../stdlib');
const { collect } = require('../../stdlib');
const { relative, sep, join, resolve, dirname } = require('path');
const { typedefMdRe } = require('./rules/typedef-md');
const { read } = require('./');
const { parseFile } = require('typal');
const { codeRe, commentRule } = require('./rules');
const { methodTitleRe } = require('./rules/method-title');
const { macroRule, useMacroRule } = require('./rules/macros');
const { competent } = require('../../stdlib');
const { Transform } = require('stream');

const extract = async (location, { recordOriginalNs, rootNamespace }) => {
  const xml = await read(location)
  const { types, imports } = parseFile(xml, rootNamespace, location)
  if (recordOriginalNs) {
    const { types: types2 } = parseFile(xml, null, location)
    types2.forEach(({ ns }, i) => {
      types[i].originalNs = ns
    })
  }
  return { types, imports }
}

/**
 * A Typedefs class will detect and store in a map all type definitions embedded into the documentation.
 */
class Typedefs extends Replaceable {
  constructor(rootNamespace, { wiki, source, recordOriginalNs } = {}) {
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
        async replacement(match, location, typeName, link) {
          const file = this.file // read early before async

          if (this.hasCache(location, typeName)) return
          this.addCache(location, typeName)

          try {
            const { types, imports } = await extract(location, { recordOriginalNs, rootNamespace })

            this.emit('types', {
              location,
              types: [...imports, ...types],
              typeName,
              file,
              link,
            })
          } catch (e) {
            this.log('(%s) Could not process typedef-md: %s', location, e.message)
            this.log(e.stack)
          }
        },
      },
    ], { objectMode: true })
    /** @type {!Array<import('typal/src').Type>} */
    this.types = []
    /** @type {!Array<{fullName: string, link: string, description:string }>} */
    this.included = []
    /**
     * The locations of read types.
     */
    this.locations = {}
    this.on('types', ({ location, types, typeName, file, link = '' }) => {
      link = link.replace(/^-/, '')
      if (wiki) {
        const rf = relative(source, file)
        const [page] = rf.split(sep, 1)
        file = join(source, page)
      }
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
        if (!link) b.appearsIn = [file]
        else b.typeLink = link // set arbitrary link to use for linking in typedef/index.jsx
        if (imp) {
          this.log('Adding import %s', fullName)
          this.types.push(b)
          return b
        }
        if (typeName && name == typeName) {
          this.log('Adding type by matched name %s', fullName)
          this.types.push(b)
          return b
        } else if (typeName) {
          return
        }
        if (link)
          this.log('Adding type link %s to %s', fullName, link)
        else this.log('Adding type %s at %s', fullName, this.file)
        this.types.push(b)
        return b
      }).filter(Boolean)
      // this.types.push(...types)
      if (link) return
      const oldLocationTypes = this.locations[location] || []
      this.locations = {
        ...this.locations,
        [location]: [...oldLocationTypes, ...added],
      }
    })
    this.cache = {}
    this.file = null
  }
  updateImports() {
    if (this._importsUpdated) return
    const imports = this.types.filter(({ import: i }) => i)
    const included = this.included.filter(({ description, fullName: k, link, icon, iconAlt, iconOdd, iconEven }) => {
      const ii = imports.filter(({ fullName }) => fullName == k)
      ii.forEach((i) => {
        if (!i.link) i.link = link
        if (!i.description) i.description = description
        if (!i.icon) i.icon = icon
        if (!i.iconAlt) i.iconAlt = iconAlt
        if (!i.iconOdd) i.iconOdd = iconOdd
        if (!i.iconEven) i.iconEven = iconEven
      })
      return !ii.length
    })
    this.included = included
    this._importsUpdated = true
  }
  get log() {
    if (/doc/.test(process.env.NODE_DEBUG)) return console.error
    return () => {}
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
 * @param {Stream} stream
 * @param {string} [namespace] The root namespace.
 * @param {Array<string>} [typesLocations]
 * @param {Object} [options]
 * @param {boolean} [options.wiki] To know if to update refs from PageA/index.md to PageA.
 * @param {boolean} [options.source] The documentation source.
 */
const getTypedefs = async (stream, namespace, typesLocations = [], options = {}) => {
  const typedefs = new Typedefs(namespace, options)
  const proc = async (children, file, { link, typeName } = {}) => {
    let [location] = children
    location = location.trim()
    if (typedefs.hasCache(location, typeName)) return
    typedefs.addCache(location, typeName)
    const { types, imports } = await extract(location, { ...options, rootNamespace: namespace })
    typedefs.emit('types', {
      location,
      types: [...imports, ...types],
      file,
      typeName,
      link,
    })
  }
  await Promise.all(typesLocations.map(async (location) => {
    await proc([location], 'mock.md')
  }))
  const c = competent({
    async'typedef'({ name, children }) {
      await proc(children, this.file, { typeName: name })
      return null
    },
    async'method'({ children }) {
      await proc(children, this.file)
      return null
    },
    async'type-link'({ link, children }) {
      await proc(children, this.file, { link })
      return null
    },
    'include-typedefs'({ children, icon, 'icon-alt': iconAlt, 'icon-odd': iconOdd, 'icon-even': iconEven }) {
      let [loc] = children
      loc = loc.trim() || 'typedefs.json'
      let data
      try {
        // if a package is referenced
        const p = `${loc}/package.json`
        const { typedefs: td } = require(p)
        const pl = require.resolve(p)
        if (td) loc = join(dirname(pl), td)
        else throw new Error(`typedefs field not found in ${loc}/package.json`)
      } catch (err) {
        loc = resolve(loc)
      }
      data = require(loc)
      Object.entries(data).forEach(([k, d]) => {
        const n = `${namespace}.`
        if (namespace && k.startsWith(n)) k = k.replace(n, '')
        const t = {
          fullName: k,
          icon, iconAlt, iconOdd, iconEven,
          ...d,
        }
        this.included.push(t)
      })
    },
  })

  // const r = new Replaceable(c)
  const t = new Transform({
    async transform({ data, file }, enc, next) {
      if (!data && !file)
        return next(new Error('No data or file, make sure to pipe in stream in Object mode.'))
      if (data == 'separator' || !data.trim()) return next()
      if (!/\.(md|html)$/.test(file)) return next()

      // Competent components
      const r = new Replaceable(c)
      r.file = file
      r.included = typedefs.included
      const d = await replace(r, data)
      this.push({ data: d, file })
      next()
    },
    objectMode: true,
  })
  includeNodeTypedefs(t)
  stream.pipe(t).pipe(typedefs)

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
  })
  // const { types, locations } = typedefs
  return typedefs
}

const includeNodeTypedefs = (t) => {
  const icons = resolve(__dirname, '../icons')
  const nodeTypedefs = resolve(__dirname, '../../typedefs.json')
  const nodeIcon = join(icons, 'node.png')
  const nodeIconOdd = join(icons, 'node-odd.png')
  const nodeIconEven = join(icons, 'node-even.png')

  t.write({ data: `<include-typedefs icon-odd="${nodeIconOdd}" icon-even="${nodeIconEven}" icon="${nodeIcon}" icon-alt="Node.JS Docs">
    ${nodeTypedefs}
  </include-typedefs>`, file: 'nodejs.md' })
}

module.exports = Typedefs
module.exports.getTypedefs = getTypedefs