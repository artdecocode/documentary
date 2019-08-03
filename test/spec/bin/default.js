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
  async 'caches module'({ docWithEnv }, _, { write, resolve }) {
    const DOCUMENTARY_CACHE_LOCATION = resolve('.cache')
    const env = {
      DOCUMENTARY_CACHE_LOCATION,
      NODE_DEBUG: 'doc',
    }
    const modulePath = await write('module.js', 'console.log("module")')
    const readme = await write('index.md', `<fork>${modulePath}</fork>`)
    let { stdout, stderr } = await docWithEnv(readme, env)
    ok(/module has no cache/.test(stderr), 'Module should have no cache.')
    ;({ stdout, stderr } = await docWithEnv(readme, env))
    ok(/cached/.test(stderr), 'Module should have been cached.')
    return stdout
  },
}

export default T
