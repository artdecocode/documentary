const NL = '<br/>'
const I = '&nbsp;&nbsp;' // indent

/**
 * Writes method title. Not exported, has to be invoked manually.
 * @param {Object} opts
 * @param {import('typal/types').Method} opts.method
 * @param {number} opts.level
 * @param {import('../lib/Documentary').default} opts.documentary
 */
export default function Method({ documentary, method, level = 2, noArgTypesInToc }) {
  const hash = '#'.repeat(level)
  let sig = getSig(method)
  sig = `${hash} ${sig}`

  const dtoc = documentary.addDtoc('MT', {
    args: method.args.map(({ name, type, shortType, optional }) => {
      const N = `${name}${optional ? '=' : ''}`
      return [N, type, shortType]
    }),
    hash,
    isAsync: method.async,
    name: method.name,
    returnType: method.return,
    replacedTitle: sig,
    noArgTypesInToc,
  })
  documentary.annotateType(method, sig)

  return `${dtoc}${sig}`
}

/**
 * @param {import('typal/types').Method} method
 */
export const getSig = (method) => {
  // cache
  if (method.fullName && getSig[method.fullName]) return getSig[method.fullName]

  let sig = `<code>${method.async ? 'async ' : ''}<ins>${method.name}</ins>(`

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

  let ret = method.return
  try {
    if (method.isConstructor && method.isParsedFunction) {
      ret = method.parsed.function.new.name
    }
  } catch (err) {
    // ok ?
  }
  // let done
  if (lines.length) {
    const nls = `${NL}${I.repeat(1)}`
    const s = lines.join(nls)
    sig += '</code>'
    sig += `<sub>${nls}${s}${NL}`
    sig += `</sub><code>): <i>${ret || 'void'}</i></code>`
  } else {
    sig += `): <i>${ret || 'void'}</i></code>`
  }
  if (method.fullName) getSig[method.fullName] = sig
  return sig
}