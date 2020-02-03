import { EOL } from 'os'
import { c as color } from 'erte'
import Md2html from '../../components/Html'
import render from '@depack/render'

const LOG = /doc/.test(process.env.NODE_DEBUG) ? console.error : (() => {})

/**
 * Check if any of the columns had new lines.
 */
const hasNewLines = (rows) => {
  return rows.some((row) => {
    return row.some((column) => {
      return /\r?\n/.test(column)
    })
  })
}

const mapNewLines = (rows) => {
  return rows.map((row) => {
    return row.map((column) => {
      return column.replace(/\r?\n/g, '<br/>')
    })
  })
}

const HtmlTable = ({ header = [], rows = [], insertInnerCode }) => {
  return (<table>
    <tr>{header.map((he, i)=> {
      return <th key={i} dangerouslySetInnerHTML={{
        __html: Md2html({ children: [he], documentary: { insertInnerCode } }),
      }} />
    })}</tr>
    {rows.map((row, i) => {
      return <tr key={i}>{row.map((c, j) => {
        return <td key={j} dangerouslySetInnerHTML={{
          __html: Md2html({ children: [c], documentary: { insertInnerCode } }),
        }} />
      })}</tr>
    })}
  </table>)
}

/**
 *
 * @param {*} match
 * @param {*} macro
 * @param {string} table
 */
export function replacer(match, macro, table) {
  const { tableMacros = {} } = this
  const macroFn = tableMacros[macro]
  try {
    let res = JSON.parse(table)
    res = mapNewLines(res)
    const [header, ...rows] = res
    // const newLines = hasNewLines(res)
    // if (newLines) return render(<HtmlTable
    //   header={header} rows={rows} insertInnerCode={this.insertInnerCode} />, {
    //   pretty: true,
    //   lineLength: 100,
    // })
    const realRows = macroFn ? rows.map(macroFn) : rows
    const replacedData = this.replaceInnerCode
      ? [header, ...realRows].map(c => c.map(cc => this.replaceInnerCode(cc || '')))
      : [header, ...realRows]
    const lengths = findLengths(replacedData)
    const sep = lengths.map(l => '-'.repeat(l))
    const replacedHeader = replacedData[0]
    const he = getRow(header, lengths, true, replacedHeader)
    const a = [
      sep,
      ...realRows,
    ].map(r => getRow(r, lengths))
    return [he, ...a].join(EOL)
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
    const columnLengths = columns
      .map(c => c || '')
      .map(({ length }) => length)
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

const getRow = (row, lengths, center = false, adjustments) => {
  const cols = row.map((col, i) => {
    const c = col || ''
    const l = lengths[i]
    const realValue = adjustments ? adjustments[i] || '' : c
    const r = center ? padMiddle(realValue, l) : padRight(realValue, l)
    const rr = r.replace(realValue, c)
    return rr
  })
  const s = `| ${cols.join(' | ')} |`
  return s
}

const re = /```table(?: +(.+) *)?\n([\s\S]+?)\n```/mg

const tableRule = {
  re,
  replacement: replacer,
}

export { re as tableRe }

export default tableRule
