import makeTestSuite from '@zoroaster/mask'
import TempContext from 'temp-context'
import Context from '../context'

export default makeTestSuite('test/result/bin/index', {
  fork: Context.DOC,
})

export const components = makeTestSuite('test/result/bin/components', {
  context: TempContext,
  fork: {
    module: Context.DOC,
    /**
     * @param {string} _
     * @param {TempContext} t
     */
    async getArgs(_, { add, write }) {
      await write('test.md', this.input)
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