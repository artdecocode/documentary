import { deepEqual } from 'zoroaster/assert'
import { makeTestSuite } from 'zoroaster'
import { collect } from 'catchment'
import { getStream } from '../../src/lib'
import Typedefs from '../../src/lib/Typedefs'

const ts = makeTestSuite('test/result/typedefs', {
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
    deepEqual(actual, locations)
  },
  jsonProps: ['locations'],
})

export default ts