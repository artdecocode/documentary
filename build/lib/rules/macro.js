       const re = /^%TABLE-MACRO (.+)\n([\s\S]+?)\n%(\n|$)/gm

/**
 * Reverse a string.
 * @param {string} s String to reverse.
 */
const reverse = s => s.split('').reverse().join('')

/**
 * @param {string} match
 * @param {string} name
 * @param {string} body
 */
function replacement(match, name, body) {
  /**
   * @param {string[]} row
   */
  const fn = (row) => {
    const hasEscapedComma = /\\,/.test(body)
    const parts = hasEscapedComma
      ? reverse(body).split(/,(?!\\)/).reverse().map(reverse)
      : body.split(',')
    const mappedParts = parts.map(p => {
      const t = hasEscapedComma ? p.replace(/\\,/g, ',') : p
      const tt = this.replaceInnerCode ? this.replaceInnerCode(t) : t
      const r = tt
        .replace(/\$(\d+)/g, (_, s) => {
          const i = parseInt(s)
          const val = row[i - 1]
          return val
        })
      return r.trim()
    })
    return mappedParts
  }
  this.tableMacros = this.tableMacros || {}
  this.tableMacros[name] = fn
  return ''
}

const rule = {
  re,
  replacement,
}

module.exports=rule

module.exports.re = re
//# sourceMappingURL=macro.js.map