import { makeTestSuite } from 'zoroaster'
import { resolve } from 'path'
import Context from '../../context'

const getPath = (mask) => {
  return resolve(__dirname, '../../mask/Documentary', `${mask}.md`)
}

const make = (name) => {
  const n = name.replace(/^!/, '')
  const ts = makeTestSuite(getPath(n), {
    /**
     * @param {string} input
     * @param {Context} context
     */
    async getResults(input, { Documentary, catchment }) {
      const doc = new Documentary()
      doc.end(input)
      return await catchment(doc, true)
    },
    context: Context,
  })
  return ts
}

const names = [
  'toc-titles', 'table', 'code', 'comments',
]

const TestSuite = names.reduce((acc, name) => {
  return {
    ...acc,
    [name]: make(name),
  }
}, {})

export default TestSuite