const { debuglog } = require('util');
const { rexml } = require('../../../stdlib');

const LOG = debuglog('doc')

const typeRe = /^%TYPE( .+)?\n([\s\S]+?)\n%$/mg


const tag = (t, s) => `<${t}>${s}</${t}>`
const strong = s => tag('strong', s)

const getDescAndExample = (description, example, isExampleRow, hasExamples) => {
  const span2 = hasExamples ? ' colspan="2"' : ''
  if (!example) {
    return `<td${span2}>${description}</td>`
  }
  if (isExampleRow) {
    return `<td${span2}>${description}</td>
  </tr>
  <tr></tr>
  <tr>
   <td colspan="${hasExamples ? 4 : 3}">${example}</td>`
  }
  return `<td>${description}</td>
   <td>${example}</td>`
}

const makeTable = (properties, tocTitles) => {
  const hasExamples = properties.some(({ example, isExampleRow }) => example && !isExampleRow)
  const rows = properties.map(({ name, type, required, description = '', example = '', isExampleRow }) => {
    const t = `<code>${required ? `${name}*` : name}</code>`
    const n = required ? strong(t) : t
    const nn = tocTitles ? `[${n}](t)` : n
    const e = example.startsWith('```') ? `\n\n${example}`: example
    return `  <tr>
   <td>${nn}</td>
   <td>${tag('em', type)}</td>
   ${getDescAndExample(description, e, isExampleRow, hasExamples)}
  </tr>`
  })
  return `<table>
 <thead>
  <tr>
   <th>Property</th>
   <th>Type</th>
   <th>Description</th>${hasExamples ? '\n   <th>Example</th>' : ''}
  </tr>
 </thead>
 <tbody>
${rows.join('\n')}
 </tbody>
</table>
`
}

const typeRule = {
  re: typeRe,
  replacement(match, tocTitles, body) {
    try {
      const tags = rexml('p', body)
        .map(({ content, props }) => {
          const [{ content: description } = {}] = rexml('d', content)
          const [{ content: example, props: { row: isExampleRow = false } = {} } = {}] = rexml('e', content)
          return {
            description,
            example,
            isExampleRow,
            ...props,
          }
        })
      const table = makeTable(tags, tocTitles)
      return table
    } catch (err) {
      LOG('Could not parse type, %s', err.message)
      return match
    }
  },
}

// const b = (summary, alt, gif) => {
//   return `
// <details>
//   <summary>${summary}</summary>
//   <table>
//   <tr><td>
//     <img alt="${alt}" src="${gif}" />
//   </td></tr>
//   </table>
// </details>
// `.trim()
// }

module.exports=typeRule


module.exports.typeRe = typeRe