async function test() {
  process.stdout.write('ttt')
}

/**
 * @typedef {import('koa-multer').StorageEngine} StorageEngine
 * @typedef {import('http').IncomingMessage} IncomingMessage
 * @typedef {import('koa-multer').File} File
 */

/**
 * @typedef {Object} Test This is test description.
 * @typedef {Object} SessionConfig Description of Session Config.
 * @prop {string} key cookie key.
 * @prop {number|'session'} [maxAge=86400000] maxAge in ms. Default is 1 day. `session` will result in a cookie that expires when session/browser is closed. Warning: If a session cookie is stolen, this cookie will never expire. Default `86400000`.
 * @prop {boolean} [overwrite] Can overwrite or not. Default `true`.
 * @prop {boolean} [httpOnly] httpOnly or not or not. Default `true`.
 * @prop {boolean} [signed=false] Signed or not. Default `false`.
 * @prop {boolean} [rolling] Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. Default `false`.
 * @prop {boolean} [renew] Renew session when session is nearly expired, so we can always keep user logged in. Default `false`.
 */

/**
 * @typedef {Object} Limits
 * @prop {number} [fieldNameSize] Max field name size (Default: 100 bytes).
 * @prop {number} [fieldSize] Max field value size (Default: 1MB).
 * @prop {number} [fields] Max number of non- file fields (Default: Infinity).
 * @prop {number} [fileSize] For multipart forms, the max file size (in bytes)(Default: Infinity).
 * @prop {number} [files] For multipart forms, the max number of file fields (Default: Infinity).
 * @prop {number} [parts] For multipart forms, the max number of parts (fields + files)(Default: Infinity).
 * @prop {number} [headerPairs] For multipart forms, the max number of header key=> value pairs to parse Default: 2000 (same as node's http).
 *
 * @typedef {Object} MulterConfig
 * @prop {string} [dest] Where to store the files.
 * @prop {StorageEngine} [storage] Where to store the files.
 * @prop {(req: IncomingMessage, file: File, callback: (error: Error | null, acceptFile: boolean)) => void} [fileFilter] Function to control which files are accepted.
 * @prop {Limits} [limits] Limits of the uploaded data.
 * @prop {boolean} [preservePath=false] Keep the full path of files instead of just the base name.
 */

export default test
