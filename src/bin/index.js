#!/usr/bin/env node
import { watch } from 'fs'
import { debuglog } from 'util'
import { lstatSync } from 'fs'
import run from './run'
import getArgs from './get-args'
import runJs from './run/js'
import runExtract from './run/extract'
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
  typedef: _typedef,
  version: _version,
  extract: _extract,
} = getArgs()

if (_version) {
  console.log(version)
  process.exit(0)
}

if (process.argv.find(a => a == '-p') && !_push) {
  catcher('Please specify a commit message.')
}
if (process.argv.find(a => a == '-e') && !_extract) {
  catcher('Please specify where to extract typedefs.')
}

if (_source) {
  try {
    lstatSync(_source)
  } catch (err) {
    if (err.message) err.message = `Could not read input ${_source}: ${err.message}`
    catcher(err)
  }
}

const doc = async (source, output, justToc = false) => {
  if (!source) {
    throw new Error('Please specify an input file.')
  }
  const stream = getStream(source)
  await run(stream, output, justToc)
}

(async () => {
  if (_extract) {
    await runExtract({
      source: _source,
      extract: _extract,
    })
    return
  }
  if (_typedef) {
    await runJs({
      source: _source,
      output: _output,
    })
    return
  }
  try {
    await doc(_source, _output, _toc)
  } catch ({ stack, message, code }) {
    DEBUG ? LOG(stack) : console.log(message)
  }

  let debounce = false
  if (_watch || _push) {
    // also watch referenced example files.
    watch(_source, { recursive: true }, async () => {
      if (!debounce) {
        debounce = true
        await doc(_source, _output, _toc)
        if (_push) {
          console.log('Pushing documentation changes.')
          await gitPush(_source, _output, _push)
        }
        debounce = false
      }
    })
  }
})()
