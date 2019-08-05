const { h } = require('preact');
/**
 * Writes method title.
 * @param {Object} opts
 * @param {import('typal/src/lib/Type').default} opts.method
 * @param {number} opts.level
 * @param {Object} opts.documentary
 * @param {import('../lib/Documentary').default} opts.documentary.documentary
 */
function Method({ documentary: { documentary }, method, level = 2 }) {
  const hash = '#'.repeat(level)
  const sig = `${hash} ${method._async ? '`async ' : '`'}${method.name}(`
  const endSig = `): ${method.return || 'void'}\``
  const nl = '<br/>'
  const i = '&nbsp;&nbsp;'
  
  let done = `${sig}${endSig}`

  const lines = method._args.map(({ name, type, optional }) => {
    const N = `${name}${optional ? '=' : ''}`
    if (typeof type == 'string') {
      return `\`${N}: ${type},\``
    }
    // type can be object when coming from method title.
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

  if (lines.length) {
    const nls = `${nl}${i.repeat(1)}`
    const s = lines.join(nls)
  
    done = `${sig}\`${nls}${s}${nl}\`${endSig}`
  }

  const dtoc = documentary.addDtoc('MT', {
    args: method._args.map(({ name, type, shortType }) => {
      return [name, type, shortType]
    }),
    hash,
    isAsync: method._async,
    name: method.name,
    returnType: method.return,
    replacedTitle: done,
  })

  return `${dtoc}${done}`
}

module.exports = Method