const Documentary = require('./Documentary');

               function createReplaceStream(toc, cacheLocation) {
  const s = new Documentary({
    toc,
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