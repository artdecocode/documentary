import Method from '../../components/method'

const re = /```(#+)( async)? (.+?)(?: => (.+))?(\n[\s\S]*?)?```/g

/**
 * @this {import('../Documentary')}
 */
export const replacer = function (match, level, isAsync, name, returnType, jsonArgs) {
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

export { re as methodTitleRe }
export default methodTitleRule