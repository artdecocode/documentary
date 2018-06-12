/**
 * A testing context for the package.
 */
export default class Context {
  async _init() {
    console.log('init context')
  }
  /**
   * Example method.
   */
  example() {
    return 'OK'
  }
  async _destroy() {
    console.log('destroy context')
  }
}
