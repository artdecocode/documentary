#!/usr/bin/env node
import { watch } from 'fs'
import { debuglog } from 'util'
import { lstatSync } from 'fs'
import run from './run'
import getArgs from './get-args'
import generateTypedef from './run/generate'
import extractTypedef from './run/extract'
import { version } from '../../package.json'
import catcher from './catcher'
import { getStream, gitPush } from '../lib'

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

const doc = async ({ source, output, justToc = false, h1 }) => {
  if (!source) {
    throw new Error('Please specify an input file.')
  }
  const stream = getStream(source)
  await run(stream, output, justToc, h1)
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
