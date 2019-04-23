import { fork } from 'spawncommand'
import { c } from 'erte'
import { resolve } from 'path'
import resolveDependency from 'resolve-dependency'
import clearR from 'clearr'
import compare from '@depack/cache'
import { codeSurround } from '..'

const replacement = async function (match, noCache, old, err, lang, m) {
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
      this.log('%s cached', s)
      const { 'stderr': stderr, 'stdout': stdout } = record
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
  re: /( *)%([!_]+)?FORK(ERR)?(?:-(\w+))? (.+)%/mg,
  async replacement(match, ws, service, err, lang, m) {
    const noCache = /!/.test(service) || this.noCache
    const old = /_/.test(service)
    try {
      let res =
        await replacement.call(this, match, noCache, old, err, lang, m)
      if (ws) res = res.replace(/^/gm, ws)
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

export default forkRule