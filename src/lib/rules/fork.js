import { fork } from 'spawncommand'
import staticAnalysis from 'static-analysis'
import { lstat } from 'fs'
import { c } from 'erte'
import makePromise from 'makepromise'
import { resolve } from 'path'
import resolveDependency from 'resolve-dependency'
import { codeSurround } from '..'

const getMtime = async (entry) => {
  /** @type {import('fs').Stats} */
  const stat = await makePromise(lstat, entry)
  const mtime = stat.mtime
  return mtime.getTime()
}

const replacement = async function (match, noCache, old, err, lang, m) {
  const cache = this.getCache('fork')
  const [mod, ...args] = m.split(' ')

  const { path: mmod } = await resolveDependency(mod)
  const s = `FORK${err || ''}${lang ? `-${lang}` : ''}: ${c(mmod, 'yellow')} ${
    args.map(a => c(a, 'grey')).join(' ')}`

  if (noCache) {
    this.log(s, noCache ? ':: no cache' : '')
    const { stdout, stderr } = await doFork(old, mod, args)
    return getOutput(err, stderr, stdout, lang)
  }

  const sa = await staticAnalysis(mod, {
    shallow: true,
    soft: true,
  })
  const msa = await Promise.all(sa.map(async ({ entry, name, internal, version }) => {
    if (name) return `${name} ${version}`
    if (internal) return internal
    const mtime = await getMtime(entry)
    return `${entry} ${mtime}`
  }))
  const mmtime = await getMtime(mmod)

  let printed = false
  if (cache) {
    const record = cache[m]
    if (record) {
      if (record.mtime == mmtime) {
        const added = []
        const removed = []
        msa.forEach((mm) => {
          if (!record.analysis.includes(mm)) {
            added.push(mm)
          }
        })
        record.analysis.forEach((mm) => {
          if (!record.analysis.includes(mm)) {
            removed.push(mm)
          }
        })
        const changed = added.length || removed.length
        if (!changed) {
          this.log(s, ':: returning cache')
          return getOutput(err, record.stderr, record.stdout, lang)
        }
        printed = true
        this.log(s, ':: dependencies changed')
        added.forEach((mm) => {
          const [entry, meta] = mm.split(' ')
          let mmeta = ''
          if (meta) {
            mmeta = /^\d+$/.test(meta) ? new Date(parseInt(meta)).toLocaleString() : meta
          }
          this.log(c('+', 'green'), entry, mmeta)
        })
        removed.forEach((mm) => {
          const [entry, meta] = mm.split(' ')
          let mmeta
          if (meta) {
            mmeta = /^\d+$/.test(meta) ? new Date(parseInt(meta)).toLocaleString() : meta
          }
          this.log(c('-', 'red'), entry, mmeta)
        })
      } else {
        printed = true
        this.log(s, `:: ${mmod} source updated since ${new Date(record.mtime).toLocaleString()}.`)
      }
    }
  }

  !printed && this.log(s)

  const { stdout, stderr } = await doFork(old, mod, args)

  const cacheToWrite = makeCache(m, mmtime, msa, stdout, stderr)
  await this.addCache('fork', cacheToWrite)

  return getOutput(err, stderr, stdout, lang)
}

const doFork = async (old, mod, args) => {
  const documentaryFork = resolve(__dirname, '../../fork')
  const { promise } = fork(old ? mod : documentaryFork, args, {
    execArgv: [],
    stdio: 'pipe',
    ...(old ? {} : {
      env: { DOCUMENTARY_REQUIRE: resolve(mod) },
    }),
  })
  const { stdout, stderr } = await promise
  return { stdout, stderr }
}

const forkRule = {
  re: /%([!_]+)?FORK(ERR)?(?:-(\w+))? (.+)%/mg,
  async replacement(match, service, err, lang, m) {
    const noCache = /!/.test(service) || this.noCache
    const old = /_/.test(service)
    try {
      return await replacement.call(this, match, noCache, old, err, lang, m)
    } catch (e) {
      this.log(c(`FORK ${m} error`, 'red'))
      this.log(e)
      return match
    }
  },
}

const replaceR = (s) => {
  const st = s.split('\n').map(l => {
    const r = l.split('\r')
    const last = r[r.length - 1]
    return last
  }).join('\n')
  return st
}

const getOutput = (err, stderr, stdout, lang) => {
  const res = err ? stderr : stdout
  const r = res.trim().replace(/\033\[.*?m/g, '')
  return codeSurround(replaceR(r), lang)
}

/**
 * @param {string} m The path to the module and arguments
 */
const makeCache = (m, mtime, analysis, stdout, stderr) => {
  return {
    [m]: {
      mtime,
      analysis,
      stdout,
      stderr,
    },
  }
}

export default forkRule