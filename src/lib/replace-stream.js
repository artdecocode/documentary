import { replaceStream } from 'restream'
import { debuglog } from 'util'
import { tableRule, titleRule } from '.'

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
      replacement: tableRule,
    },
    titleRule,
  ])
  return s
}
