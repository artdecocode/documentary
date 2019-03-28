import Documentary from './Documentary'

export default function createReplaceStream(cacheLocation) {
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
