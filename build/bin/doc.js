#!/usr/bin/env node
const { _source, _output, _toc, _watch, _push, _version, _extract, _h1, _reverse, _generate, _noCache, _namespace, _help, argsConfig, _wiki, _types, _focus } = require('./get-args');
const { watch } = require('fs');
const { debuglog } = require('util');
const { lstatSync } = require('fs');
let alamode = require('alamode'); if (alamode && alamode.__esModule) alamode = alamode.default;
const { dirname } = require('path');
let usually = require('usually'); if (usually && usually.__esModule) usually = usually.default;
const { reduceUsage } = require('argufy');
const doc = require('./run/doc');
const catcher = require('./catcher');
const { gitPush } = require('../lib');

const LOG = debuglog('doc')
const DEBUG = /doc/.test(process.env['NODE_DEBUG'])

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
    wiki: _wiki, types: _types, focus: _focus,
  }
  let files
  try {
    files = await doc(docOptions) // ./run.js
  } catch ({ stack, message, code }) {
    DEBUG ? LOG(stack) : console.log(message)
  }

  if (_watch || _push) {
    let debounce = false
    /** @type {!Array<!fs.FSWatcher>} */
    let filesWatching = []

    const watcher = async () => {
      if (debounce) return
      debounce = true
      filesWatching.forEach((fs) => {
        fs.close()
      })

      files = await doc(docOptions)
      if (_push) {
        console.log('Pushing documentation changes.')
        await gitPush(_source, _output, _push, files)
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