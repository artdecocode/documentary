const { rexml } = require('../../../stdlib');
const macroRe = /^(%+)MACRO (.+)\r?\n([\s\S]+?)\r?\n\1(\r?\n|$)/gm
const useMacroRe = /^%USE-MACRO (.+)\r?\n([\s\S]+?)\r?\n%$/gm

/**
 * @param {string} match
 * @param {string} _
 * @param {string} name
 * @param {string} body
 */
function macroReplacement(match, _, name, body) {
  /** @param {string[]} data */
  const fn = (data) => {
    const res = body.replace(/\$(\d+)/g, (__, s) => {
      const i = parseInt(s)
      const val = data[i - 1]
      return val
    })
    return res
  }
  this.macros = this.macros || {}
  this.macros[name] = fn
  return ''
}

function useMacroReplacement(match, macro, body) {
  const { macros = {} } = this
  const macroFn = macros[macro]
  if (!macroFn) return match
  try {
    const res = rexml('data', body)
    const r = res.map(({ content }) => content)
    const rr = macroFn(r)
    return rr
  } catch (err) {
    console.log(err.message)
    return match
  }
}

const macroRule = {
  re: macroRe,
  replacement: macroReplacement,
}
const useMacroRule = {
  re: useMacroRe,
  replacement: useMacroReplacement,
}



module.exports.macroRe = macroRe
module.exports.useMacroRe = useMacroRe
module.exports.macroRule = macroRule
module.exports.useMacroRule = useMacroRule