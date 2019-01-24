import { makeTestSuite } from 'zoroaster'
import TempContext from 'temp-context'
import Context from '../context'

const ts = makeTestSuite('test/result/bin/index.js', {
  fork: Context.DOC,
})

export const components = makeTestSuite('test/result/bin/components.md', {
  context: TempContext,
  fork: {
    module: Context.DOC,
    /**
     * @param {string} _
     * @param {TempContext} t
     */
    async getArgs([comp], { add, write }) {
      await write('test.md', comp)
      await add('test/fixture/.documentary')
      return ['test.md']
    },
    /**
     * @param {TempContext} t
     */
    getOptions({ TEMP }) {
      return {
        cwd: TEMP,
        env: {
          NODE_DEBUG: 'doc',
        },
      }
    },
  },
})

export default ts