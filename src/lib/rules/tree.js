import spawncommand from 'spawncommand'
import { debuglog } from 'util'

const LOG = debuglog('doc')

const treeRule = {
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
}

const codeSurround = (m, lang = 'm') => `\`\`\`${lang}\n${m.trim()}\n\`\`\``

export default treeRule
