async function test() {
  process.stdout.write('ttt')
}

/**
 * @typedef {import('http').IncomingMessage} IncomingMessage
 */

/**
 * @typedef {(m: IncomingMessage)} Test This is test function.
 *
 * @typedef {Object} SessionConfig Description of Session Config.
 * @prop {string} key cookie key.
 * @prop {number|'session'} [maxAge=86400000] maxAge in ms. `session` will result in a cookie that expires when session/browser is closed.
 * @prop {boolean} [overwrite] Can overwrite or not. Default `true`.
 * @prop {boolean} [httpOnly] httpOnly or not or not. Default `true`.
 * @prop {boolean} [renew] Renew session when session is nearly expired, so we can always keep user logged in. Default `false`.
 */


export default test
