/**
 * This is the main package file.
 */
async function documentary() {
  console.log('documentary called')
}

/**
 * A nested structure representing levels of headers in the MarkDown file.
 * @param {Readable} structure
 */
// export const toc = (readable) => {
//   // const t = new Tran
//   // return Object.keys(structure)
// }

const $_lib_Toc = require('./lib/Toc');


module.exports = documentary
module.exports.Toc = $_lib_Toc