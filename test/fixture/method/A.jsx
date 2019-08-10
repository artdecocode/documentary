export const method = ({ documentary: { documentary }, method, level = 2, noArgTypesInToc }) => {
  const h = '#'.repeat(level)
  const heading = `${h} ${method.async ? 'async ' : ''}${method.name}`
  const attrs = method.args.map(({ name, type, optional }) => {
    let n = `${name}`
    if (optional) n = `[${n}]`
    return n
  }).join(', ')
  const res = `${heading}()

<code>${method.name}(${attrs})</code>`
  return res
}