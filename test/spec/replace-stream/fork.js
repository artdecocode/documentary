import Context, { MarkdownSnapshot } from '../../context'
// import TempContext from 'temp-context'
import createReplaceStream from '../../../src/lib/replace-stream'

/** @type {Object.<string, (c: Context )>} */
const T = {
  context: [Context, MarkdownSnapshot],
  async 'forks a node.js process'({ createReadable, FORK_PATH, Documentary }) {
    const s = `
Below is the output of the program:

%FORK ${FORK_PATH}%
`
    const rs = createReadable(s)
    const stream = new Documentary({ noCache: true })
    rs.pipe(stream)
    return stream
  },
  async 'forks a node.js process with language'({ createReadable, FORK_PATH, Documentary }) {
    const s = `
Below is the output of the program:

%FORK-json ${FORK_PATH}%
`
    const rs = createReadable(s)
    const stream = new Documentary({ noCache: true })
    return rs.pipe(stream)
  },
  'removes \\r from the output'({ createReadable, Documentary }) {
    const rs = createReadable('<fork env="INDICATRIX_PLACEHOLDER=0">test/fixture/indicatrix</fork>')
    const stream = new Documentary({ noCache: true })
    return rs.pipe(stream)
  },
}

export default T

/** @type {Object.<string, (c: Context, t: TempContext)>} */
export const cache = process.env.CI ? undefined : {
  context: Context,
  // this will break on git clone when fixture's mtime changes, todo mock fs.lstat
  async'reads the cache of the fork'({ createReadable, catchment }) {
    const p = 'test/temp/output.txt'
    const rs = createReadable(`%FORK test/fixture/fork ${p}%`)
    const stream = createReplaceStream('test/fixture/.documentary/cache')
    rs.pipe(stream)
    const stdout = await catchment(stream)

    const rs2 = createReadable(`%FORKERR test/fixture/fork ${p}%`)
    const stream2 = createReplaceStream('test/fixture/.documentary/cache')
    rs2.pipe(stream2)
    const stderr = await catchment(stream2)
    return { stdout, stderr }
  },
}