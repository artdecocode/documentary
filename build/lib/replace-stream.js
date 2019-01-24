const Documentary = require('./Documentary');

               function createReplaceStream(toc) {
  const s = new Documentary({
    toc,
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
//# sourceMappingURL=replace-stream.js.map