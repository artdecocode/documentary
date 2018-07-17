#!/usr/bin/env node
import { watch } from 'fs'
import argufy from 'argufy'
import { lstatSync, createReadStream } from 'fs'
import Pedantry from 'pedantry'
import { debuglog } from 'util'
import spawn from 'spawncommand'
import run from './run'

const LOG = debuglog('doc')
const DEBUG = /doc/.test(process.env.NODE_DEBUG)

const {
  source: _source,
  output: _output,
  toc: _toc,
  watch: _watch,
  push: _push,
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
  push: {
    short: 'p',
  },
})

if (process.argv.find(a => a == '-p') && !_push) {
  console.log('Please specify a commit message.')
  process.exit(1)
}

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
  let debounce = false
  if (_watch) {
    watch(_source, { recursive: true }, async () => {
      if (!debounce) {
        debounce = true
        await doc(_source, _output, _toc)
        if (_push) {
          await gitPush(_source, _output, _push)
        }
        setTimeout(() => { debounce = false }, 100)
      }
    })
  }
})()

const gitPush = async (source, output, message) => {
  const { stdout } = (await spawn('git', ['log', '--format=%B', '-n', '1'])).trim()
  if (stdout == message) {
    await spawn('git', ['reset', 'HEAD~1'])
  }
  await spawn('git', ['add', source, output])
  await spawn('git', ['commit', '-m', message])
  await spawn('git', ['push', '-f'])
}