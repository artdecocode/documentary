import { getLinks } from 'typal'

/**
 * @param {import('typal/types').Method} method
 * @param {Array<import('typal/types').Type>} allTypes
 * @param {import('typal/types').LinkingOptions} linkingOpts
 */
export const makeMethodTable = (method, allTypes = [], linkingOpts, {
  indent = ' - ', join = '\n', preargs = '\n\n',
} = {}) => {
  let table = method.description || ''
  const lis = method.args.map(({ optional, name, type, description }) => {
    optional = optional || name.startsWith('...')
    const N = optional ? name : `<strong>${name}*</strong>`

    let typeWithLink = type
      , useCode = false
    typeWithLink = getLinks(allTypes, type, linkingOpts)
    useCode = typeWithLink != type
    typeWithLink = wrapCode(typeWithLink, useCode)

    let n = `${indent}<kbd>${N}</kbd> <em>${
      typeWithLink
    }</em>${optional ? ' (optional)' : ''}`
    if (description) n += `: ${description}`
    return n
  }).join(join)
  table += lis ? ((table ? preargs : '') + lis) : ''
  return table
}

const wrapCode = (s, useCode = false) => {
  return `${useCode ? '<code>' : '`'}${s}${useCode ? '</code>' : '`'}`
}
