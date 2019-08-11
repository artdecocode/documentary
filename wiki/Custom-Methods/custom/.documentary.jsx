/**
 * A method title for Documentary.
 * @param {Object} opts
 * @param {import('typal/types').Method} opts.method
 * @param {import('documentary')} opts.documentary
 */
export const method = ({ method, level, documentary }) => {
  const hash = '#'.repeat(level)
  const args = method.args.map(({ name, optional }) => {
    return optional ? `[${name}]` : name
  }).join(', ')

  const sig = `${hash} ${method.name} (${args})`

  /* can use Documentary engine to generate TOC entry
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
  }) */

  const dtoc = documentary.addDtoc('MT', {
    string: `${method.name}()`,
    replacedTitle: sig,
    level,
  })

  return `${dtoc}${sig}`
}