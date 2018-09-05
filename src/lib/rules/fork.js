import { fork } from 'spawncommand'
// import { debuglog } from 'util'

// const LOG = debuglog('doc')

const forkRule = {
  re: /%FORK(ERR)?(?:-(\w+))? (.+)%/mg,
  async replacement(match, err, lang, m) {
    const [mod, ...args] = m.split(' ')
    const { promise } = fork(mod, args, {
      execArgv: [],
      stdio: 'pipe',
    })
    const { stdout, stderr } = await promise
    const res = err ? stderr : stdout
    const hasBackticks = /```/.test(res)
    return codeSurround(res, lang, hasBackticks)
  },
}

const codeSurround = (m, lang = '', hasBackticks = false) => {
  const t = hasBackticks ? '````' : '```'
  return `${t}${lang}\n${m.trim()}\n${t}`
}

export default forkRule
