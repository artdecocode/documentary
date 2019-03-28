import { debuglog } from 'util'

const LOG = debuglog('doc')

export const replaceTitle = function (level, isAsync, method, returnType, args) {
  const sig = `${level} ${isAsync ? '`async ' : '`'}${method}(`
  const endSig = `): ${returnType ? returnType : 'void'}\``
  const nl = '<br/>'
  const i = '&nbsp;&nbsp;'
  const single = `${sig}${endSig}`
  if (!args.length) return single

  const lines = args.map(([name, type]) => {
    if (typeof type == 'string') {
      return `\`${name}: ${type},\``
    }
    const l = Object.keys(type)
      .map((key) => {
        // const isRequired = key.endsWith('?')
        const [propType, defaultValue] = type[key]
        // static?: boolean = true,
        return `${key}: ${propType}${defaultValue ? ` = ${defaultValue}` : ''}`
      })
      .map(line => `\`${line},\``)
      .join(`${nl}${i.repeat(2)}`)
    const n = `\`${name}: {\`${nl}${i.repeat(2)}${l}${nl}${i.repeat(1)}\`},\``
    return n
  })


  const nls = `${nl}${i.repeat(1)}`
  const s = lines.join(nls)

  const res = `${sig}\`${nls}${s}${nl}\`${endSig}`
  return res
}

const re = /```(#+)( async)? (\w+)(?: => (.+)\n)?([\s\S]*?)```/g

export const replacer = function (match, level, isAsync, method, returnType, jsonArgs) {
  try {
    jsonArgs = jsonArgs.trim()
    /** @type {Array} */
    const args = JSON.parse(jsonArgs || '[]')

    const val = {
      hash: level, isAsync, name: method, returnType, args,
    }
    const dtoc = this.addDtoc ? this.addDtoc('MT', val) : ''
    const res = replaceTitle.call(this, level, isAsync, method, returnType, args)
    val.replacedTitle = res
    return `${dtoc}${res}`
  } catch (err) {
    LOG('Could not parse the method title')
    return match
  }
}

const methodTitleRule = {
  re,
  replacement: replacer,
}

export { re as methodTitleRe }
export default methodTitleRule