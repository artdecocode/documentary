import { getLinks } from 'typal'

/**
 * @param {import('typal/src/lib/Type').default} method
 */
export const makeMethodTable = (method, allTypes = [], opts) => {
  let table = method.description || ''
  const lis = method._args.map(({ optional, name, type, description }) => {
    optional = optional || name.startsWith('...')
    const N = optional ? name : `<strong>${name}*</strong>`

    let typeWithLink = type
      , useCode = false
    typeWithLink = getLinks(allTypes, type, opts)
    useCode = typeWithLink != type
    typeWithLink = wrapCode(typeWithLink, useCode)

    let n = ` - <kbd>${N}</kbd> <em>${typeWithLink}</em>${optional ? ' (optional)' : ''}`
    if (description) n += `: ${description}`
    return n
  }).join('\n')
  table += lis ? ('\n\n' + lis) : ''
  return table
}

const wrapCode = (s, useCode = false) => {
  return `${useCode ? '<code>' : '`'}${s}${useCode ? '</code>' : '`'}`
}
