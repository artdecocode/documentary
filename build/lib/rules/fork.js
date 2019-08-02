const { fork } = require('spawncommand');
const { c } = require('../../../stdlib');
const { resolve } = require('path');
let resolveDependency = require('resolve-dependency'); if (resolveDependency && resolveDependency.__esModule) resolveDependency = resolveDependency.default;
const { clearr } = require('../../../stdlib');
const compare = require('@depack/cache');
const { forkfeed } = require('../../../stdlib');
const { codeSurround } = require('../');
const { Catchment } = require('../../../stdlib');

const queue = {}

const replacement = async function (noCache, old, err, lang, m, awaited = false, answers = null) {
  if (awaited) noCache = false
  const [mod, ...args] = m.split(' ')

  const { path: mmod } = await resolveDependency(mod)
  const s = `FORK${err || ''}${lang ? `-${lang}` : ''}: ${c(mmod, 'yellow')} ${
    args.map(a => c(a, 'grey')).join(' ')}`.trim()

  let printed = false

  const modules = this.getCache('modules')

  if (noCache) delete modules[mmod]
  const { hash, mtime, reason, result, currentMtime, md5 } =
    await compare(mmod, modules, (...a) => {
      if (!printed) this.log(s)
      printed = true
      console.log(...a)
    })

  let addModulesCacheLater
  if (noCache || !result) {
    printed = true
    if (noCache) { // saving cache for next time
      this.log(s, ':: no cache')
    } else if (reason == 'NO_CACHE') {
      this.log(`${s} module has no cache`)
    } else if (reason == 'MTIME_CHANGE') {
      this.log(`${s} changed since %s`, currentMtime)
    }
    const cacheToWrite = { [mmod]: {
      'mtime': mtime, 'hash': hash, 'md5': md5,
    } }
    // post-pone setting the module cache until the fork results are got
    // it case of cancelling the process with SIGINT
    addModulesCacheLater = () => this.addCache('modules', cacheToWrite)
  } else {
    const cache = this.getCache('fork')
    const record = cache[`[${md5}] ${m}`]
    if (record) {
      this.log('%s %s', s, awaited ? 'awaited' : 'cached')
      const { 'stderr': stderr, 'stdout': stdout } = record
      this.addAsset(mmod)
      return getOutput(err, stderr, stdout, lang)
    } else {
      printed = true
      this.log('%s arguments not cached', s)
    }
  }

  !printed && this.log(s)

  const { stdout, stderr } = await doFork(old, mod, args, answers)

  const cacheToWrite = { [`[${md5}] ${m}`]: {
    'stdout': stdout, 'stderr': stderr,
  } }
  await Promise.all([
    this.addCache('fork', cacheToWrite),
    addModulesCacheLater ? addModulesCacheLater() : null,
  ])

  this.addAsset(mmod)
  return getOutput(err, stderr, stdout, lang)
}

/**
 * Answers are allowed in <fork> component.
 */
const doFork = async (old, mod, args, answers = {}) => {
  const documentaryFork = resolve(__dirname, '../../fork')
  const cp = fork(old ? mod : documentaryFork, args, {
    execArgv: [],
    stdio: 'pipe',
    ...(old ? {} : {
      env: {
        DOCUMENTARY_REQUIRE: resolve(mod),
        ...process.env,
      },
    }),
  })
  let stdout, stderr, stdoutLog, stderrLog
  if (answers.stdout) {
    stdoutLog = new Catchment()
    forkfeed(cp.stdout, cp.stdin, answers.stdout, stdoutLog)
    // stdoutLog.pipe(process.stdout)
  }
  if (answers.stderr) {
    stderrLog = new Catchment()
    forkfeed(cp.stderr, cp.stdin, answers.stderr, stderrLog)
    // stderrLog.pipe(process.stderr)
  }
  const res = await cp.promise
  if (stdoutLog) stdoutLog.end()
  if (stderrLog) stderrLog.end()
  if (stdoutLog) stdout = await stdoutLog.promise
  else ({ stdout } = res)
  if (stderrLog) stderr = await stderrLog.promise
  else ({ stderr } = res)

  return { stdout, stderr }
}

const forkRule = {
  re: /( *)%([/!_]+)?FORK(ERR)?(?:-(\w+))? (.+)%/mg,
  async replacement(match, ws, service, err, lang, m, answers) {
    const noCache = /!/.test(service) || this.noCache
    const old = /_/.test(service)
    const relative = /\//.test(service)
    try {
      let awaited = false
      const q = queue[m]
      if (q) {
        this.log(`FORK: ${m} `, c(`awaiting ${q.err ? 'stderr' : 'stdout'}`, 'yellow'))
        await q.promise
        awaited = true
      }
      const promise = replacement.call(this, noCache, old, err, lang, m, awaited, answers)
      queue[m] = { promise, err }
      let res = await promise
      if (ws) res = res.replace(/^/gm, ws)
      if (relative) res = res.replace(new RegExp(`${process.cwd()}/?`, 'g'), '')
      return res
    } catch (e) {
      this.log(c(`FORK ${m} error`, 'red'))
      this.log(e)
      return match
    }
  },
}

const getOutput = (err, stderr, stdout, lang) => {
  const res = err ? stderr : stdout
  const r = res.trim().replace(/\033\[.*?m/g, '')
  return codeSurround(clearr(r), lang)
}

module.exports=forkRule