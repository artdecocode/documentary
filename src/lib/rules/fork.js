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
  if (noCache) {
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
  const { path: mmod } = await resolveDependency(mod)
  const mmtime = await getMtime(mmod)

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
        if (!changed) return getOutput(err, record.stderr, record.stdout, lang)

        this.log(`FORK: ${mod} dependencies changed:`)
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
        this.log(`FORK: ${mod} source updated since ${new Date(record.mtime).toLocaleString()}.`)
      }
    }
  }
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
    const noCache = /!/.test(service)
    const old = /_/.test(service)
    this.log(`FORK${err || ''}:`, c(m, 'grey'))
    try {
      return await replacement.call(this, match, noCache, old, err, lang, m)
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
  return codeSurround(r, lang)
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