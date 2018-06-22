import { fork } from 'spawncommand'
import { debuglog } from 'util'

// const LOG = debuglog('doc')

const forkRule = {
  re: /%FORK(?:-(\w+))? (.+)%/mg,
  async replacement(match, lang, m) {
    const [mod, ...args] = m.split(' ')
    const f = fork(mod, args, {
      execArgv: [],
      stdio: 'pipe',
    })
    const { stdout } = await f.promise
    return codeSurround(stdout, lang)
  },
}

const codeSurround = (m, lang = '') => `\`\`\`${lang}\n${m.trim()}\n\`\`\``

export default forkRule
