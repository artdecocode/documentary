#!/usr/bin/env node
import { _source, _output, _toc, _watch, _push, _version, _extract, _h1,
  _reverse, _generate, _noCache, _namespace, _help, argsConfig, _wiki,
  _types, _focus, _debug, _annotate } from './get-args'

if (_debug) {
  process.env.NODE_DEBUG = [process.env.NODE_DEBUG, 'doc']
    .filter(Boolean).join(',')
}
import { watch } from 'fs'
import { lstatSync } from 'fs'
import alamode from 'alamode'
import { dirname } from 'path'
import usually from 'usually'
import { reduceUsage } from 'argufy'
import doc from './run/doc'
import catcher from './catcher'
import { gitPush } from '../lib'

const DEBUG = /doc/.test(process.env.NODE_DEBUG) || process.env.DEBUG

if (_version) {
  console.log(require('../../package.json').version)
  process.exit(0)
} else if (_help) {
  const u = usually({
    description: 'Documentation generator https://artdecocode.com/documentary',
    usage: reduceUsage(argsConfig),
    line: 'doc source [-o output] [-trwcn] [-p "commit message"] [-h1] [-eg] [-vh]',
    example: 'doc documentary -o README.md',
  })
  console.log(u)
  process.exit(1)
}

const preact = dirname(require.resolve('preact/package.json'))
alamode({
  pragma: 'const { h } = r'+`equire("${preact}");`,
})

if (_source) {
  try {
    lstatSync(_source)
  } catch (err) {
    if (err.message) err.message = `Could not read input ${_source}: ${err.message}`
    catcher(err)
  }
}

(async () => {
  if (_extract) {
    console.log('Typal: smart typedefs https://artdecocode.com/typal/')
    console.log('Please use typal (included w/ Documentary):')
    console.log('\ntypal %s -m', _source)
    return
  }
  if (_generate) {
    console.log('Typal: smart typedefs https://artdecocode.com/typal/')
    console.log('Please use typal (included w/ Documentary):')
    console.log('\ntypal %s [--closure]', _source)
    return
  }
  const docOptions = {
    source: _source, output: _output, justToc: _toc, h1: _h1,
    reverse: _reverse, noCache: _noCache, rootNamespace: _namespace,
    wiki: _wiki, types: _types, focus: _focus, annotate: _annotate,
  }
  let files
  try {
    files = await doc(docOptions) // ./run.js
  } catch ({ stack, message, code }) {
    DEBUG ? console.error(stack) : console.log(message)
  }


  if (_watch || _push) {
    let firstTime = true
    let debounce = false
    /** @type {!Array<!fs.FSWatcher>} */
    let filesWatching = []

    const watcher = async () => {
      if (debounce) return
      debounce = true
      filesWatching.forEach((fs) => {
        fs.close()
      })

      if (!firstTime) {
        files = await doc(docOptions)
      } else firstTime = false

      if (_push) {
        console.log('Pushing %s changes...', _wiki ? 'wiki' : 'documentation')

        const sourcePromise = gitPush(_source, _output, `${_wiki ? 'Wiki: ' : ''}${_push}`, files)

        await (_wiki ? Promise.all([
          gitPush('.', _output, _push, [], _wiki),
          sourcePromise,
        ]) : sourcePromise)
      }
      filesWatching = files.map((file) => {
        const fs = watch(file, watcher)
        return fs
      })
      debounce = false
    }
    // todo: also watch referenced example files.
    watch(_source, { recursive: true }, watcher)
    await watcher()
  }
})()

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('fs').FSWatcher} fs.FSWatcher
 */