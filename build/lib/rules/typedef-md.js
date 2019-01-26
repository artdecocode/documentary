const { debuglog } = require('util');
const LOG = debuglog('doc')

       const typedefMdRe = /^%TYPEDEF (.+?)(?: (.+?))?%$/mg

/**
 * This rule is used to used to parse a typedefs XML file and place the definition of a type into documentation.
 * @todo Cache extracted types from XML files.
 * @type {{re: RegExp, replacement: AsyncReplacer}}
 */
const typedefMdRule = {
  re: typedefMdRe,
  async replacement(match, location, typeName) {

  },
}

module.exports=typedefMdRule

module.exports.typedefMdRe = typedefMdRe