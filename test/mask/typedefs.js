import { deepEqual } from 'zoroaster/assert'
import { makeTestSuite } from 'zoroaster'
import { collect } from 'catchment'
import TempContext from 'temp-context'
import { getStream } from '../../src/lib'
import Typedefs from '../../src/lib/Typedefs'

const ts = makeTestSuite('test/result/Typedefs-dir.md', {
  async getResults(input) {
    const s = getStream(input)
    const typedefs = new Typedefs()
    s.pipe(typedefs)
    await collect(typedefs)
    const { locations, types } = typedefs
    return { locations: Object.keys(locations), types }
  },
  /**
   * @param {{types: import('../../src/lib/typedef/Type').default[]}} param
   */
  mapActual({ types }) {
    const res = types.map(type => {
      return type.toMarkdown(types)
    }).join('\n')
    return res
  },
  assertResults({ locations: actual }, { locations }) {
    if(locations) deepEqual(actual, locations)
  },
  jsonProps: ['locations'],
})

const links = makeTestSuite('test/result/Typedefs', {
  /**
   * @param {string} input
   * @param {TempContext} t
   */
  async getResults(input, { write }) {
    const path = await write(input, 'test.md')
    const s = getStream(path)
    const typedefs = new Typedefs()
    s.pipe(typedefs)
    await collect(typedefs)
    const { locations, types } = typedefs
    return { locations: Object.keys(locations), types }
  },
  /**
   * @param {{types: import('../../src/lib/typedef/Type').default[]}} param
   */
  mapActual({ types }) {
    const res = types.map(type => {
      return type.toMarkdown(types)
    }).join('\n')
    return res
  },
  assertResults({ locations: actual }, { locations }) {
    if(locations) deepEqual(actual, locations)
  },
  jsonProps: ['locations'],
  context: TempContext,
})

export default ts
export { links }