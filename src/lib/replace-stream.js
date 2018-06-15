import { replaceStream } from 'restream'
import { debuglog } from 'util'

const LOG = debuglog('doc')

/**
 *
 * @param {string} [toc] The table of contents.
 */
export default function createReplaceStream(toc = '') {
  const s = replaceStream([
    {
      re: /^%TOC%$/gm,
      replacement: toc,
    },
    {
      re: /<!--[\s\S]*?-->\n*/g,
      replacement() {
        LOG('stripping comment')
        return ''
      },
    },
    {
      re: /```table([\s\S]+?)```/g,
      replacement(match, table) {
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
          LOG('could not parse the table')
          return match
        }
      },
    },
  ])
  return s
}


const getRow = (row) => {
  const s = `| ${row.join(' | ')} |`
  return s
}
