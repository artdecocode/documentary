#!/usr/bin/env node
import { watch } from 'fs'
import { lstatSync, createReadStream } from 'fs'
import Pedantry from 'pedantry'
import { debuglog } from 'util'
import spawn from 'spawncommand'
import run from './run'
import getArgs from './get-args'
import runJs from './run/js'
import runExtract from './run/extract'
import { version } from '../../package.json'

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


if(_version) {
  console.log(version)
  process.exit(0)
}

if (process.argv.find(a => a == '-p') && !_push) {
  console.log('Please specify a commit message.')
  process.exit(1)
}
if (process.argv.find(a => a == '-x') && !_extract) {
  console.log('Please specify where to extract typedefs.')
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

const docJs = async ({
  source,
  output,
  extract,
}) => {
  if (!source) {
    console.log('Please specify a JavaScript file.')
    process.exit(1)
  }

  try {
    if (extract) {
      await runExtract({ source, extract })
    } else {
      await runJs({
        source,
        output,
      })
    }
  } catch ({ stack, message }) {
    DEBUG ? LOG(stack) : console.log(message)
    process.exit(1)
  }
}


(async () => {
  if (_typedef) {
    await docJs({
      source: _source,
      output: _output,
      extract: _extract,
    })
    return
  }
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
  if (_watch || _push) {
    watch(_source, { recursive: true }, async () => {
      if (!debounce) {
        debounce = true
        await doc(_source, _output, _toc)
        if (_push) {
          console.log('Pushing documentation changes')
          await gitPush(_source, _output, _push)
        }
        setTimeout(() => { debounce = false }, 100)
      }
    })
  }
})()

const gitPush = async (source, output, message) => {
  const { promise } = spawn('git', ['log', '--format=%B', '-n', '1'])
  const { stdout } = await promise
  const s = stdout.trim()
  if (s == message) {
    await git('reset', 'HEAD~1')
  }
  await git('add', source, output)
  await git('commit', '-m', message)
  await git('push', '-f')
}

const git = async (...args) => {
  const { promise } = spawn('git', args, { stdio: 'inherit' })
  await promise
}
