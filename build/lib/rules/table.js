const { debuglog } = require('util');
const { c: color } = require('erte');

const LOG = debuglog('doc')

/**
 *
 * @param {*} match
 * @param {*} macro
 * @param {string} table
 */
       function replacer(match, macro, table) {
  const { tableMacros = {} } = this
  const macroFn = tableMacros[macro]
  try {
    const res = JSON.parse(table)
    const [header, ...rows] = res
    const realRows = macroFn ? rows.map(macroFn) : rows
    const replacedData = this.replaceInnerCode
      ? [header, ...realRows].map(c => c.map(cc => this.replaceInnerCode(cc || '')))
      : [header, ...realRows]
    const lengths = findLengths(replacedData)
    const sep = lengths.map(l => '-'.repeat(l))
    const h = getRow(header, lengths, true)
    const a = [
      sep,
      ...realRows,
    ].map(r => getRow(r, lengths))
    return [h, ...a].join('\n')
  } catch (err) {
    const token = /Unexpected token (.) in JSON at position (\d+)/.exec(err.message)
    if (token) {
      const [, t, pos] = token
      const p = parseInt(pos)
      const before = Math.max(p - 100, 0)
      const s = table.substring(before, p)
      const s2 = table.substring(p + 1, p + 100)
      const r = color(t, 'red')
      const tt = `${s}${r}${s2}`
      LOG(tt)
    }
    LOG('Could not parse the table.')
    return match
  }
}

const findLengths = (array) => {
  const [header] = array
  const lengths = array.reduce((acc, columns) => {
    const columnLengths = columns.map(({ length }) => length)
    const newAcc = columnLengths.map((l, i) => {
      const prevLength = acc[i]
      if (l > prevLength) return l
      return prevLength
    })
    return newAcc
  }, [...header].fill(0))
  return lengths
}

const padRight = (val, length) => {
  // if there was an INNER CODE it can be negative
  // but we're not gonna adjust for a toc-title.
  // TODO make %TABLE marker
  const extra = Math.max(length - val.length, 0)
  const r = ' '.repeat(extra)
  const res = `${val}${r}`
  return res
}

const padMiddle = (val, length) => {
  const extra = length - val.length
  const left = Math.floor(extra / 2)
  const right = extra - left
  const l = ' '.repeat(left)
  const r = ' '.repeat(right)
  const res = `${l}${val}${r}`
  return res
}

const getRow = (row, lengths, center = false) => {
  const cols = row.map((col, i) => {
    const c = col || ''
    const l = lengths[i]
    const r = center ? padMiddle(c, l) : padRight(c, l)
    return r
  })
  const s = `| ${cols.join(' | ')} |`
  return s
}

const re = /```table(?: +(.+) *)?\n([\s\S]+?)\n```/mg

const tableRule = {
  re,
  replacement: replacer,
}



module.exports=tableRule


module.exports.replacer = replacer
module.exports.tableRe = re
//# sourceMappingURL=table.js.map