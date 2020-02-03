import spawn from 'spawncommand'
import { deepStrictEqual } from 'assert'
import { codeSurround } from '../lib'
import { c } from 'erte'
import { EOL } from 'os'

/**
 * Executes a Java program. Caches the output.
 * @param {Object} opts
 * @param {import('../lib/Documentary').default} opts.documentary
 * @param {string[]} opts.children
 */
export default async function Java({ documentary, jar, nocache, children,
  stderr, lang = 'sh', notrim = false, console: co }) {
  const [a] = children
  const args = a.trim().split(/\s/)
  if (jar) args.unshift('-jar', jar)
  const name = args.join(' ')
  let stats, currentStats, data
  if (!nocache) {
    ({ stats, data } = documentary.getCache('java', undefined, name))
    currentStats = await args.reduce(async (acc, current) => {
      acc = await acc
      try {
        const t = await documentary.getLocaleChangeTime(current)
        acc.push({ [current]: t })
        return acc
      } catch (err) {
        return acc
      }
    }, [])
  }
  let d = data
  try {
    if (currentStats) deepStrictEqual(stats, currentStats)
  } catch (err) {
    const p = spawn('java', args)
    d = await p.promise
    if (d.code && !stderr && d.stderr) {
      documentary.log(c('java:', 'red'), c(stderr, 'grey'))
    }
    await documentary.addCache('java', { [name]: { stats: currentStats, data: d } })
  }
  let r = stderr ? d.stderr : d.stdout
  if (!notrim) r = r.trim()
  const cmd = codeSurround(r, lang)
  if (!co) return cmd

  const cc = getShellCommand(['java', ...args], `${co}:~$`)

  const CMD = codeSurround(cc, 'console')
  return `${CMD}${EOL}${EOL}${cmd}`
}

const { DOCUMENTARY_MAX_COLUMNS = 90 } = process.env

export const getShellCommand = (args, program = 'java') => {
  const maxLength = DOCUMENTARY_MAX_COLUMNS
  let lastLineLength = program.length
  const s = args.reduce((acc, current) => {
    if (lastLineLength + current.length > maxLength) {
      const space = '> '
      acc = acc + ` \\${EOL}${space}` + current
      lastLineLength = current.length + space.length
    } else {
      acc = acc + ' ' + current
      lastLineLength += current.length + 1
    }
    return acc
  }, program)
  return s
}