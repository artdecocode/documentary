import { debuglog } from 'util'

const LOG = debuglog('doc')

export const replacer = (match, table) => {
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

const tableRule = {
  re: /```table([\s\S]+?)```/g,
  replacement: replacer,
}

export default tableRule
