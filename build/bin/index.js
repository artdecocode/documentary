#!/usr/bin/env node
const { watch } = require('fs');
const { debuglog } = require('util');
const { lstatSync } = require('fs');
let alamode = require('alamode'); if (alamode && alamode.__esModule) alamode = alamode.default;
const { dirname } = require('path');
const run = require('./run');
const getArgs = require('./get-args');
const generateTypedef = require('./run/generate');
const extractTypedef = require('./run/extract');
const { version } = require('../../package.json');
const catcher = require('./catcher');
const { gitPush } = require('../lib');

const preact = dirname(require.resolve('preact/package.json'))
alamode({
  pragma: `const { h } = require("${preact}");`,
})

const LOG = debuglog('doc')
const DEBUG = /doc/.test(process.env.NODE_DEBUG)

const {
  source: _source,
  output: _output,
  toc: _toc,
  watch: _watch,
  push: _push,
  version: _version,
  extract: _extract,
  h1: _h1,
  reverse: _reverse,
} = getArgs()

let {
  generate: _generate,
  _argv,
} = getArgs()

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

if (_argv.find(g => g == '-g') && !_generate) {
  _generate = _source
}

if (_source) {
  try {
    lstatSync(_source)
  } catch (err) {
    if (err.message) err.message = `Could not read input ${_source}: ${err.message}`
    catcher(err)
  }
}

const doc = async ({ source, output, justToc = false, h1, reverse }) => {
  if (!source) {
    throw new Error('Please specify an input file.')
  }
  await run({
    source, reverse, output, justToc, h1,
  })
}

(async () => {
  if (_extract) {
    await extractTypedef({
      source: _source,
      destination: _extract,
    })
    return
  }
  if (_generate) {
    await generateTypedef({
      source: _source,
      destination: _generate,
    })
    return
  }
  try {
    await doc({
      source: _source, output: _output, justToc: _toc, h1: _h1,
      reverse: _reverse,
    })
  } catch ({ stack, message, code }) {
    DEBUG ? LOG(stack) : console.log(message)
  }

  let debounce = false
  if (_watch || _push) {
    // todo: also watch referenced example files.
    watch(_source, { recursive: true }, async () => {
      if (!debounce) {
        debounce = true
        await doc({
          source: _source, output: _output, justToc: _toc, h1: _h1,
          reverse: _reverse,
        })
        if (_push) {
          console.log('Pushing documentation changes.')
          await gitPush(_source, _output, _push)
        }
        debounce = false
      }
    })
  }
})()

//# sourceMappingURL=index.js.map