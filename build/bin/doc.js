#!/usr/bin/env node
const { _source, _output, _toc, _watch, _push, _version, _extract, _h1, _reverse, _argv, _generate, _noCache } = require('./get-args');
const { watch } = require('fs');
const { debuglog } = require('util');
const { lstatSync } = require('fs');
let alamode = require('alamode'); if (alamode && alamode.__esModule) alamode = alamode.default;
const { dirname } = require('path');
const generateTypedef = require('./run/generate');
const extractTypedef = require('./run/extract');
const doc = require('./run/doc');
const { version } = require('../../package.json');
const catcher = require('./catcher');
const { gitPush } = require('../lib');

const preact = dirname(require.resolve('preact/package.json'))
alamode({
  pragma: `const { h } = require("${preact}");`,
})

const LOG = debuglog('doc')
const DEBUG = /doc/.test(process.env['NODE_DEBUG'])

if (_version) {
  console.log(version)
  process.exit(0)
}

if (process.argv.find(a => a == '-p') && !_push) {
  catcher('Please specify a commit message.')
}
if (process.argv.find(a => a == '-e') && !_extract) {
  catcher('Please specify where to extract typedefs (- for stdout).')
}

let generate = _generate
if (_argv.find(g => g == '-g') && !_generate) {
  generate = _source
}

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
    return await extractTypedef({
      source: _source,
      destination: _extract,
    })
  }
  if (generate) {
    return await generateTypedef({
      source: _source,
      destination: generate,
    })
  }
  const docOptions = {
    source: _source, output: _output, justToc: _toc, h1: _h1,
    reverse: _reverse, noCache: _noCache,
  }
  try {
    await doc(docOptions)
  } catch ({ stack, message, code }) {
    DEBUG ? LOG(stack) : console.log(message)
  }

  let debounce = false
  if (_watch || _push) {
    // todo: also watch referenced example files.
    watch(_source, { recursive: true }, async () => {
      if (!debounce) {
        debounce = true
        await doc(docOptions)
        if (_push) {
          console.log('Pushing documentation changes.')
          await gitPush(_source, _output, _push)
        }
        debounce = false
      }
    })
  }
})()
