import { debuglog } from 'util'
import { Replaceable } from 'restream'
import extractTags from 'rexml'
import { collect } from 'catchment'
import { typedefMdRe } from './rules/typedef-md'
import { read } from '.'
import Type from './typedef/Type'

const LOG = debuglog('doc')

/**
 * A Typedefs class will detect and store in a map all type definitions embedded into the documentation.
 */
export default class Typedefs extends Replaceable {
  constructor() {
    super({
      re: typedefMdRe,
      async replacement(match, location) {
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
          this.emit('types', { location, types: [...typedefs, ...imports] })
        } catch (e) {
          LOG('(%s) Could not process typedef-md: %s', location, e.message)
        }
      },
    })
    this.types = []
    this.locations = {}
    this.on('types', ({ location, types }) => {
      this.types.push(...types)
      this.locations = {
        ...this.locations,
        [location]: types,
      }
    })
  }
}

export const getTypedefs = async (stream) => {
  const typedefs = new Typedefs()
  stream.pipe(typedefs)
  await collect(typedefs)
  const { types, locations } = typedefs
  return { types, locations }
}