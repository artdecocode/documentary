const NL = '<br/>'
const I = '&nbsp;&nbsp;' // indent

/**
 * Writes method title.
 * @param {Object} opts
 * @param {import('typal/src/lib/Method').default} opts.method
 * @param {number} opts.level
 * @param {Object} opts.documentary
 * @param {import('../lib/Documentary').default} opts.documentary.documentary
 */
export default function Method({ documentary: { documentary }, method, level = 2, noArgTypesInToc }) {
  const hash = '#'.repeat(level)
  let sig = `${hash} <code>${method.async ? 'async ' : ''}<ins>${method.name}</ins>(`

  const lines = method.args.map(({ name, type, optional }) => {
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
      .join(`${NL}${I.repeat(2)}`)
    const n = `\`${N}: {\`${NL}${I.repeat(2)}${l}${NL}${I.repeat(1)}\`},\``
    return n
  })

  // let done
  if (lines.length) {
    const nls = `${NL}${I.repeat(1)}`
    const s = lines.join(nls)
    sig += '</code>'
    sig += `<sub>${nls}${s}${NL}`
    sig += `</sub><code>): <i>${method.return || 'void'}</i></code>`
  } else {
    sig += `): <i>${method.return || 'void'}</i></code>`
  }

  const dtoc = documentary.addDtoc('MT', {
    args: method.args.map(({ name, type, shortType, optional }) => {
      const N = `${name}${optional ? '=' : ''}`
      return [N, type, shortType]
    }),
    hash,
    isAsync: method._async,
    name: method.name,
    returnType: method.return,
    replacedTitle: sig,
    noArgTypesInToc,
  })

  return `${dtoc}${sig}`
}