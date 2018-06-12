import { debuglog } from 'util'
import { fork } from 'spawncommand'
import { resolve } from 'path'

const LOG = debuglog('context')
const TEST_BUILD = process.env.BABEL_ENV == 'test-build'

/**
 * A testing context for the package.
 */
export default class Context {
  async _init() {
    LOG('init context')
  }
  /**
   * Example method.
   */
  example() {
    return 'OK'
  }
  get README() {
    return
  }
  get README_PATH() {
    return resolve(__dirname, '../fixtures/README-source.md')
  }
  get SNAPSHOT_DIR() {
    return resolve(__dirname, '../snapshot')
  }
  async toc(input) {
    const proc = fork(TEST_BUILD ?
      resolve(__dirname, '../../build/bin/index.js') :
      resolve(__dirname, '../../src/bin/register.js'),
    ['-t', input], {
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
    LOG('destroy context')
  }
}
