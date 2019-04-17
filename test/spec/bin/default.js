import { ok } from 'assert'
import TempContext from 'temp-context'
import Zoroaster from 'zoroaster'
import Context from '../../context'

/** @type {Object.<string, (c: Context, z:Zoroaster, t:TempContext)>} */
const T = {
  context: [Context, Zoroaster, TempContext],
  async 'generates correct markdown'({ doc, README_PATH }, { snapshotExtension }) {
    const { stdout } = await doc(README_PATH)
    snapshotExtension('md')
    return stdout.trim()
  },
  async 'generates correct markdown and saves it to a file'({ doc, README_PATH }, { snapshotSource }, { read, resolve }) {
    const p = resolve('output.md')
    const { stdout } = await doc(README_PATH, '-o', p)
    ok(/Saved/.test(stdout))
    const s = await read('output.md')
    snapshotSource('generates correct markdown', 'md')
    return s.trim()
  },
}

export default T
