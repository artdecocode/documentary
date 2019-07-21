export default function typedef({ documentary: { locations, allTypes }, children, name, narrow, flatten }) {
  const [location] = children
  const types = locations[location]
  if (!types) {
    throw new Error(`No types for location ${location}`, )
  }
  const t = name ? types.filter(a => a.name == name) : types

  const typesToMd = t.filter(({ import: i }) => !i)
  let flattened = {}
  const tt = typesToMd.map(i => i.toMarkdown(allTypes, { narrow, flatten(n) {
    flattened[n] = true
  } }))
  // found those imports that will be flattened
  const importsToMd = t
    .filter(({ import: i }) => i)
    .filter(({ fullName }) => !(fullName in flattened))
  const j = importsToMd.map(i => i.toMarkdown(allTypes, { narrow, flatten }))

  const res = [
    ...tt,
    ...j,
  ].join('\n\n')

  return res
}