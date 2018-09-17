import { debuglog } from 'util'
const LOG = debuglog('doc')

export const typedefMdRe = /^%TYPEDEF (.+?)(?: (.+?))?%$/mg

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

export default typedefMdRule