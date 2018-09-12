import Documentary from './Documentary'

export default function createReplaceStream(toc) {
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
