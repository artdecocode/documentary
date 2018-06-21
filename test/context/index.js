import { debuglog } from 'util'
import { fork } from 'spawncommand'
import { resolve } from 'path'
import { unlink, createReadStream } from 'fs'
import Catchment from 'catchment'
import { Readable } from 'stream'

const LOG = debuglog('doc')
const TEST_BUILD = process.env.BABEL_ENV == 'test-build'

/**
 * A testing context for the package.
 */
export default class Context {
  async _init() {
    // LOG('init context')
    await new Promise((r) => {
      unlink(this.OUTPUT, () => {
        r()
      })
    })
  }
  get examplePath() {
    return 'test/fixtures/example.js'
  }
  /**
   * @param {RegExp} re Regular expression to reset.
   */
  resetRe(re) {
    re.lastIndex = -1
  }
  /**
   * Example method.
   */
  example() {
    return 'OK'
  }
  /**
   * A path to a temporary file which does not exist at the beginning of test context.
   */
  get OUTPUT() {
    const p = resolve(__dirname, '../fixtures/output.md')
    return p
  }
  async readOutput() {
    const rs = createReadStream(this.OUTPUT)
    const res = await this.catchment(rs)
    return res
  }
  /**
   * Create a readable stream which will push the passed string.
   * @param {string} s The string to push.
   */
  createReadable(s) {
    const rs = new Readable({
      read() {
        this.push(s)
        this.push(null)
      },
    })
    return rs
  }
  // get README() {
  //   return
  // }
  /**
   * Path to the source readme file with %TOC% marker for replacement.
   */
  get README_PATH() {
    return resolve(__dirname, '../fixtures/README-source.md')
  }
  get README_DIR_PATH() {
    return resolve(__dirname, '../fixtures/README')
  }
  get SNAPSHOT_DIR() {
    return resolve(__dirname, '../snapshot')
  }
  /**
   * Run the binary.
   * @param {string} input Path to the source readme file
   */
  async doc(input, ...args) {
    const proc = fork(TEST_BUILD ?
      resolve(__dirname, '../../build/bin/index.js') :
      resolve(__dirname, '../../src/bin/register.js'),
    [input, ...args], {
      stdio: 'pipe',
      execArgv: [],
    })
    LOG(proc.spawnCommand)
    const { stdout, stderr } = await proc.promise
    return {
      stdout,
      stderr,
    }
  }
  /**
   * A markdown document headers structure, e.g.,
   * `{ hello: [] }
   */
  get structure() {

  }
  async _destroy() {
    // LOG('destroy context')
  }
  /**
   * Catch the output of the stream into a string.
   * @param {Readable} rs
   */
  async catchment(rs) {
    const { promise } = new Catchment({ rs })
    const res = await promise
    return res.trim()
  }
  get table() {
    return `
The program accepts the following arguments:

\`\`\`table
${this.innerTable}
\`\`\`
`
  }
  get innerTable() {
    return `[
  ["arg", "description"],
  ["-f", "Display only free domains"],
  ["-z", "A list of zones to check"]
]`
  }
  getTitle(a = true, args = true, ret = true) {
    return `
## API

\`\`\`### ${a ? 'async ' : ''}runSoftware${ret ? ' => string' : ''}
${args ? this.innerTitle: ''}
\`\`\`
`.trim()
  }
  get innerTitle() {
    return `[
  ["path", "string"],
  ["config", {
    "View": ["Container"],
    "actions": ["object"],
    "static?": ["boolean", true],
    "render?": ["function"]
  }]
]`
  }
  get comment() {
    return '<!-- hello world -->'
  }
  get codeBlock() {
    return `
\`\`\`
const t = 'new test value: '
const s = t + 'test'
console.log(s)
\`\`\`
`
  }
}
