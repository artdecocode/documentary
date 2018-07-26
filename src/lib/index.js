import tableRule from './rules/table'
import titleRule from './rules/method-title'
import { createReadStream } from 'fs'
import Catchment from 'catchment'

export const getLink = (title) => {
  const l = title
    .replace(/<\/?code>/g, '')
    .replace(/<\/?strong>/g, '')
    .replace(/<br\/>/g, '')
    .replace(/&nbsp;/g, '')
    .replace(/[^\w-\d ]/g, '')
    .toLowerCase()
    .replace(/[, ]/g, '-')
  return l
}

export const makeARegexFromRule = (rule) => {
  const re = new RegExp(`^${rule.re.source}`)
  return re
}

export const exactTable = makeARegexFromRule(tableRule)
export const exactMethodTitle = makeARegexFromRule(titleRule)

export const read = async (source) => {
  const rs = createReadStream(source)
  const data = await new Promise(async (r, j) => {
    const { promise } = new Catchment({ rs })
    rs.on('error', j)
    const res = await promise
    r(res)
  })
  return data
}
