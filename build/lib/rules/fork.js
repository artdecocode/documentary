const { fork } = require('spawncommand');
const { codeSurround } = require('..');;
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
    return codeSurround(res.trim(), lang)
  },
}


module.exports=forkRule

//# sourceMappingURL=fork.js.map