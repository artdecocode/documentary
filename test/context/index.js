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
  get SNAPSHOT_DIR() {
    return resolve(__dirname, '../snapshot')
  }
  /**
   * Run the toc command.
   * @param {string} input Path to the source readme file
   */
  async toc(input, ...args) {
    const proc = fork(TEST_BUILD ?
      resolve(__dirname, '../../build/bin/index.js') :
      resolve(__dirname, '../../src/bin/register.js'),
    ['-t', input, ...args], {
      stdio: 'pipe',
    })
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
}
