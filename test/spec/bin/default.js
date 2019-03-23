import { ok } from 'assert'
import TempContext from 'temp-context'
import Context from '../../context'

/** @type {Object.<string, (c: Context, t:TempContext)>} */
const T = {
  context: [Context, TempContext],
  async 'generates correct markdown'({ doc, README_PATH }) {
    const { stdout } = await doc(README_PATH)
    return stdout.trim()
  },
  async '!generates correct markdown and saves it to a file'({ doc, README_PATH }, { TEMP, snapshot }) {
    const { stdout } = await doc(README_PATH, '-o', `${TEMP}/output.md`)
    ok(/Saved/.test(stdout))
    const s = await snapshot('output.md')
    return s.trim()
  },
}

export default T
