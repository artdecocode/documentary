/**
 * Finds the `%TYPEDEF types.xml TypeName%` marker.
 */
       const typedefMdRe = /^%TYPEDEF (.+?)(?: (.+?))?%$/mg

module.exports.typedefMdRe = typedefMdRe