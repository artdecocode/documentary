import { deepEqual } from 'zoroaster/assert'
import makeTestSuite from '@zoroaster/mask'
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

export const main = makeTestSuite('test/result/Typedefs', {
  /**
   * @param {string} input
   */
  async getResults(input) {
    const typedefs = new Typedefs()
    typedefs.end(input)
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

const rest2 = makeTestSuite('test/result/Typedefs2', {
  /**
   * @param {string} input
   * @param {TempContext} t
   */
  async getResults(input, { write }) {
    const pp = await write('types.xml', input)
    const marker = `%TYPEDEF ${pp}%`
    const typedefs = new Typedefs()
    typedefs.end(marker)
    await collect(typedefs)
    const { locations, types } = typedefs
    return { locations: Object.keys(locations), types }
  },
  /**
   * @param {{types: import('typal/build/lib/Type')[]}} param
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

export default {
  ...ts,
  ...rest2,
}