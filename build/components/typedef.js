const { h } = require('preact');
function typedef({ documentary: { locations, allTypes }, children, name, narrow }) {
  const [location] = children
  const types = locations[location]
  if (!types) {
    throw new Error(`No types for location ${location}`, )
  }
  const t = name ? types.filter(a => a.name == name) : types
  const res = t.map((type) => {
    return type.toMarkdown(allTypes, { narrow })
  }).join('\n\n')
  return res
}

module.exports = typedef