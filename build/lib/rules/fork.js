const { fork } = require('spawncommand');
const { c } = require('erte');
const { resolve } = require('path');
let resolveDependency = require('resolve-dependency'); if (resolveDependency && resolveDependency.__esModule) resolveDependency = resolveDependency.default;
let clearR = require('clearr'); if (clearR && clearR.__esModule) clearR = clearR.default;
let compare = require('@depack/cache'); if (compare && compare.__esModule) compare = compare.default;
const { codeSurround } = require('..');

const queue = {}

const replacement = async function (noCache, old, err, lang, m, awaited = false) {
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
    await this.addCache('modules', cacheToWrite)
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

  const { stdout, stderr } = await doFork(old, mod, args)

  const cacheToWrite = { [`[${md5}] ${m}`]: {
    'stdout': stdout, 'stderr': stderr,
  } }
  await this.addCache('fork', cacheToWrite)

  this.addAsset(mmod)
  return getOutput(err, stderr, stdout, lang)
}

const doFork = async (old, mod, args) => {
  const documentaryFork = resolve(__dirname, '../../fork')
  const { promise } = fork(old ? mod : documentaryFork, args, {
    execArgv: [],
    stdio: 'pipe',
    ...(old ? {} : {
      env: {
        DOCUMENTARY_REQUIRE: resolve(mod),
        ...process.env,
      },
    }),
  })
  const { stdout, stderr } = await promise
  return { stdout, stderr }
}

const forkRule = {
  re: /( *)%([/!_]+)?FORK(ERR)?(?:-(\w+))? (.+)%/mg,
  async replacement(match, ws, service, err, lang, m) {
    const noCache = /!/.test(service) || this.noCache
    const old = /_/.test(service)
    const noRelative = /\//.test(service)
    try {
      let awaited = false
      const q = queue[m]
      if (q) {
        this.log(`FORK: ${m} `, c(`awaiting ${q.err ? 'stderr' : 'stdout'}`, 'yellow'))
        await q.promise
        awaited = true
      }
      const promise = replacement.call(this, noCache, old, err, lang, m, awaited)
      queue[m] = { promise, err }
      let res = await promise
      if (ws) res = res.replace(/^/gm, ws)
      if (!noRelative) res = res.replace(process.cwd(), '')
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
  return codeSurround(clearR(r), lang)
}

module.exports=forkRule