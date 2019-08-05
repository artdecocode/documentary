const Method = require('../../components/method');

const re = /```(#+)( async)? (.+?)(?: => (.+))?(\n[\s\S]*?)?```/g

/**
 * @this {import('../Documentary')}
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
    _async: !!isAsync,
    return: returnType,
    _args: args.map(([n, type, shortType]) => {
      return { name: n, type, shortType }
    }),
  }
  try {
    const m = Method({
      method,
      documentary: { documentary: this },
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

module.exports.replacer = replacer
module.exports.methodTitleRe = re