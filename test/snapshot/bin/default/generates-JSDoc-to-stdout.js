async function test() {
  process.stdout.write('ttt')
}

/* documentary test/fixtures/typedef/import.xml */
/**
 * @typedef {import('http').IncomingMessage} IncomingMessage
 * @typedef {import('http').ServerResponse} ServerResponse
 * @typedef {import('koa-multer').StorageEngine} StorageEngine
 * @typedef {import('koa-multer').File} File
 *
 * @typedef {(f: File) => void} Function A function to save a file.
 */

export default test