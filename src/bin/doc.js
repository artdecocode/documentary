#!/usr/bin/env node
import { _source, _output, _toc, _watch, _push, _version, _extract, _h1, _reverse, _argv, _generate } from './get-args'
import { watch } from 'fs'
import { debuglog } from 'util'
import { lstatSync } from 'fs'
import alamode from 'alamode'
import { dirname } from 'path'
import generateTypedef from './run/generate'
import extractTypedef from './run/extract'
import doc from './run/doc'
import { version } from '../../package.json'
import catcher from './catcher'
import { gitPush } from '../lib'

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

(async () => {
  if (_extract) {
    return await extractTypedef({
      source: _source,
      destination: _extract,
    })
  }
  if (_generate) {
    return await generateTypedef({
      source: _source,
      destination: _generate,
    })
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
