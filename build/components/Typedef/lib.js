const { h } = require('preact');
const { getLinks } = require('typal');
const { clone } = require('../../../stdlib');
const { basename, dirname, join: joinPath } = require('path');

/**
 * @param {import('typal/types').Method} method
 * @param {Array<import('typal/types').Type>} allTypes
 * @param {import('typal/types').LinkingOptions} [linkingOpts]
 */
const makeMethodTable = (method, allTypes = [], linkingOpts = {}, {
  indent = ' - ', join = '\n', preargs = '\n\n', wiki,
} = {}) => {
  let table = method.description || ''
  const lis = method.args.map(({ optional, name, type, description }) => {
    optional = optional || name.startsWith('...')
    const N = optional ? name : `<strong>${name}*</strong>`

    let typeWithLink = type
      , useCode = false
    typeWithLink = getLinks(allTypes, type, {
      ...linkingOpts,
      nameProcess(n) {
        const nn = n.replace('!', '')
        const found = allTypes.find(({ fullName }) => fullName == nn)

        if (!found) return n
        const { icon, iconAlt = 'Type Icon' } = found
        if (!icon) return n
        let iconPath = joinPath('.documentary', 'type-icons', basename(icon))
        const to = wiki ? joinPath(wiki, iconPath) : iconPath
        clone(icon, dirname(to))
        const s = `<img src="${iconPath}" alt="${iconAlt}">${n}`
        // debugger
        return s
      },
    })
    useCode = typeWithLink != type
    typeWithLink = wrapCode(typeWithLink, useCode)

    let n = `${indent}<kbd>${N}</kbd> <em>${
      typeWithLink
    }</em>${optional ? ' (optional)' : ''}`
    if (description) n += `: ${description}`
    return n
  }).join(join)
  table += lis ? ((table ? `${table.endsWith('`'.repeat(3)) ? '\n' : ''}${preargs}` : '') + lis) : ''
  return table
}

const wrapCode = (s, useCode = false) => {
  return `${useCode ? '<code>' : '`'}${s}${useCode ? '</code>' : '`'}`
}


module.exports.makeMethodTable = makeMethodTable