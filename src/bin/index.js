#!/usr/bin/env node
import { watch } from 'fs'
import argufy from 'argufy'
import { lstatSync, createReadStream } from 'fs'
import Pedantry from 'pedantry'
import { debuglog } from 'util'
import run from './run'

const LOG = debuglog('doc')
const DEBUG = /doc/.test(process.env.NODE_DEBUG)

const {
  source: _source,
  output: _output,
  toc: _toc,
  watch: _watch,
} = argufy({
  source: {
    command: true,
  },
  toc: {
    short: 't',
    boolean: true,
  },
  watch: {
    short: 'w',
    boolean: true,
  },
  output: 'o',
})

const doc = async (source, output, justToc = false) => {
  if (!source) {
    console.log('Please specify an input file.') // print usage
    process.exit(1)
  }
  const ls = lstatSync(source)
  let stream
  if (ls.isDirectory()) {
    stream = new Pedantry(source)
  } else if (ls.isFile()) {
    stream = createReadStream(source)
  }
  await run(stream, output, justToc)
}

(async () => {
  try {
    await doc(_source, _output, _toc)
  } catch ({ stack, message, code }) {
    if (code == 'ENOENT') {
      console.log('File %s does not exist.', _source)
      process.exit(2)
    }
    DEBUG ? LOG(stack) : console.log(message)
  }
  if (_watch) {
    watch(_source, async () => {
      await doc(_source, _output, _toc)
    })
  }
})()
