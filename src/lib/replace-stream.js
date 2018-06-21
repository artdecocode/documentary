import { Replaceable } from 'restream'
import { debuglog } from 'util'
import spawncommand from 'spawncommand'
import { badgeRule, createTocRule, commentRule, codeRe } from './rules'
import { exactTable, exactMethodTitle } from '../lib'
import tableRule from './rules/table'
import titleRule from './rules/method-title'
import exampleRule from './rules/example'

const LOG = debuglog('doc')

export default function createReplaceStream(toc) {
  const tocRule = createTocRule(toc)

  const codeBlocks = []
  const marker = `%%_DOCUMENTARY_REPLACEMENT_${Date.now()}_%%`
  const s = new Replaceable([
    commentRule,
    {
      re: codeRe,
      replacement(match) {
        if (exactTable.test(match) || exactMethodTitle.test(match)) {
          return match
        }
        codeBlocks.push(match)
        return marker
      },
    },
    {
      re: /%TREE (.+)%/mg,
      async replacement(match, m) {
        const args = m.split(' ')
        const p = spawncommand('tree', ['--noreport', ...args])
        try {
          const { stdout } = await p.promise
          if (/\[error opening dir\]/.test(stdout)) {
            LOG('Could not generate a tree for %s', args.join(' '))
            return match
          }
          return codeSurround(stdout)
        } catch (err) {
          if (err.code == 'ENOENT') {
            console.warn('tree is not installed')
            return match
          }
          LOG(err.message)
          return match
        }
      },
    },
    tocRule,
    badgeRule,
    tableRule,
    titleRule,
    exampleRule,
    {
      re: new RegExp(marker, 'g'),
      replacement() {
        return codeBlocks.shift()
      },
    },
  ])

  return s
}

const codeSurround = (m, lang = 'm') => `\`\`\`${lang}\n${m.trim()}\n\`\`\``
