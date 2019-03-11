const { fork } = require('spawncommand');
const { codeSurround } = require('..');

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
    const r = res.trim().replace(/\033\[.*?m/g, '')
    return codeSurround(r, lang)
  },
}


module.exports=forkRule
