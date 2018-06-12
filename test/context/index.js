import { debuglog } from 'util'

const LOG = debuglog('context')

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
