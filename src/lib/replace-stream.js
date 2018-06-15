import { replaceStream } from 'restream'
import { debuglog } from 'util'
import { tableRule, titleRule } from '.'

const LOG = debuglog('doc')

export default function createReplaceStream(toc) {
  const s = replaceStream([
    {
      re: /<!--[\s\S]*?-->\n*/g,
      replacement() {
        LOG('stripping comment')
        return ''
      },
    },
    {
      re: /^%TOC%$/gm,
      replacement: toc,
    },
    {
      re: /```table([\s\S]+?)```/g,
      replacement: tableRule,
    },
    titleRule,
  ])
  return s
}
