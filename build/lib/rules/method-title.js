const re = /```(#+)( async)? (.+?)(?: => (.+))?(\r?\n[\s\S]*?)?```/g

/**
 * @this {Documentary}
 */
const replacer = function (match, level, isAsync, name, returnType, jsonArgs) {
  let args
  try {
    jsonArgs = jsonArgs.trim()
    /** @type {Array} */
    args = JSON.parse(jsonArgs || '[]')
  } catch (err) {
    this.log('Could not parse the method title')
    return match
  }

  const method = {
    name,
    async: !!isAsync,
    return: returnType,
    args: args.map(([n, type, shortType]) => {
      const optional = n.endsWith('=')
      if (optional) n = n.replace(/=$/, '')
      return { name: n, type, shortType, optional }
    }),
  }
  try {
    const m = this.Method({
      method,
      level: level.length,
    })
    return m
  } catch (err) {
    this.log('Could not create method: %s', err.message)
  }
}

const methodTitleRule = {
  re,
  replacement: replacer,
}

module.exports=methodTitleRule

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../Documentary').default} Documentary
 */

module.exports.replacer = replacer
module.exports.methodTitleRe = re