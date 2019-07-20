const spawn = require('spawncommand');
const { debuglog } = require('util');

const LOG = debuglog('doc')

const treeRule = {
  re: /( *)%TREE (.+)%/mg,
  async replacement(match, ws, m) {
    const args = m.split(' ')
    const p = spawn('tree', ['--noreport', ...args])
    try {
      const { stdout } = await p.promise
      if (/\[error opening dir\]/.test(stdout)) {
        LOG('Could not generate a tree for %s', args.join(' '))
        return match
      }
      let s = codeSurround(stdout)
      s = s.replace(/^/mg, ws)
      return s
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

module.exports=treeRule
