import makeTestSuite from '@zoroaster/mask'
import run from '../../src/bin/run'
import TempContext from 'temp-context'

export const wiki = makeTestSuite('test/result/wiki/test-lib.md', {
  context: TempContext,
  /** @param {TempContext} t */
  async getResults({ TEMP, snapshot }) {
    await run({
      wiki: TEMP,
      source: this.input,
    })
    return await snapshot()
  },
})