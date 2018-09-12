import { debuglog } from 'util'

const LOG = debuglog('doc')

export function replacer(match, macro, table) {
  const { tableMacros = {} } = this
  const macroFn = tableMacros[macro]
  try {
    const res = JSON.parse(table)
    const [header, ...rows] = res
    const realRows = macroFn ? rows.map(macroFn) : rows
    const a = [
      getRow(header),
      getRow(header.map(({ length }) => '-'.repeat(length))),
      ...realRows.map(getRow),
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

const re = /```table(?: +(.+) *)?\n([\s\S]+?)\n```$/mg

const tableRule = {
  re,
  replacement: replacer,
}

export { re as tableRe }

export default tableRule
