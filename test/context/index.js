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
  /**
   * A markdown document headers structure, e.g.,
   * `{ hello: [] }
   */
  get structure() {

  }
  async _destroy() {
    console.log('destroy context')
  }
}
