const { h } = require('preact');
const { EOL } = require('os');
const { getLinks } = require('typal');

const makeIconsName = (allTypes, documentary) => {
  function nameProcess(n, odd) {
    const nn = n.replace('!', '')
    const found = allTypes.find(({ fullName }) => fullName == nn)

    if (!found) return n
    const { icon, iconAlt = 'Type Icon', iconOdd, iconEven } = found
    let i
    if (odd !== undefined) {
      i = odd ? iconOdd : iconEven
    } else if (icon) i = icon
    if (!i) return n
    const iconPath = documentary.addFile(i, 'type-icons')
    const s = `<img src="${iconPath}" alt="${iconAlt}">${n}`
    return s
  }
  return nameProcess
}

/**
 * @param {import('typal/types').Method} method
 * @param {Array<import('typal/types').Type>} allTypes
 * @param {import('typal/types').LinkingOptions} [linkingOpts]
 */
const makeMethodTable = (method, allTypes = [], linkingOpts = {}, {
  indent = ' - ', join = EOL, preargs = `${EOL}${EOL}`, documentary,
} = {}) => {
  let table = method.description || ''
  const nameProcess = makeIconsName(allTypes, documentary)
  const lis = method.args.map(({ optional, name, type, description }) => {
    optional = optional || name.startsWith('...')
    const N = optional ? name : `<strong>${name}*</strong>`

    let typeWithLink = type
      , useCode = false
    typeWithLink = getLinks(allTypes, type, {
      ...linkingOpts,
      nameProcess,
    })
    useCode = typeWithLink != type
    typeWithLink = wrapCode(typeWithLink, useCode)

    let n = `${indent}<kbd>${N}</kbd> <em>${
      typeWithLink
    }</em>${optional ? ' (optional)' : ''}`
    if (description) n += `: ${description}`
    return n
  }).join(join)
  table += lis ? ((table ? `${table.endsWith('`'.repeat(3)) ? EOL : ''}${preargs}` : '') + lis) : ''
  return table
}

const wrapCode = (s, useCode = false) => {
  return `${useCode ? '<code>' : '`'}${s}${useCode ? '</code>' : '`'}`
}


module.exports.makeIconsName = makeIconsName
module.exports.makeMethodTable = makeMethodTable