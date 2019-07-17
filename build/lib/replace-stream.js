const Documentary = require('./Documentary');

function createReplaceStream(cacheLocation) {
  const s = new Documentary({
    cacheLocation,
  })

  return s
}

// {
//   re: /[\s\S]*/,
//   replacement(match) {
//     debugger
//     return match
//   },
// },


module.exports = createReplaceStream