import { fork } from 'spawncommand'
// import { debuglog } from 'util'

// const LOG = debuglog('doc')

const forkRule = {
  re: /%FORK(?:-(\w+))? (.+)%/mg,
  async replacement(match, lang, m) {
    const [mod, ...args] = m.split(' ')
    const { promise } = fork(mod, args, {
      execArgv: [],
      stdio: 'pipe',
    })
    const { stdout } = await promise
    const hasBackticks = /```/.test(stdout)
    return codeSurround(stdout, lang, hasBackticks)
  },
}

const codeSurround = (m, lang = '', hasBackticks = false) => {
  const t = hasBackticks ? '````' : '```'
  return `${t}${lang}\n${m.trim()}\n${t}`
}

export default forkRule
