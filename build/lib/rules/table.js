const { debuglog } = require('util');

const LOG = debuglog('doc')

       const replacer = (match, table) => {
  const t = table.trim()
  try {
    const res = JSON.parse(t)
    const [header, ...rows] = res
    const a = [
      getRow(header),
      getRow(header.map(({ length }) => '-'.repeat(length))),
      ...rows.map(getRow),
    ]
    return a.join('\n')
  } catch (err) {
    LOG('Could not parse the table.')
    return match
  }
}

const getRow = (row) => {
  const s = `| ${row.join(' | ')} |`
  return s
}

const re = /```table([\s\S]+?)```/mg

const tableRule = {
  re,
  replacement: replacer,
}



module.exports=tableRule


module.exports.replacer = replacer
module.exports.tableRe = re
//# sourceMappingURL=table.js.map