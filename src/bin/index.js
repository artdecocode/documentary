#!/usr/bin/env node
import { watchFile } from 'fs'
import argufy from 'argufy'
import { createReadStream } from 'fs'
import { readDirStructure } from 'wrote'
import { debuglog } from 'util'
// import runFile from './file'
// import runDir from './dir'
import run from './run'
import createDirStream from '../lib/dir-stream';

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

const doc = async (source, output, toc) => {
  if (!source) {
    console.log('Please specify an input file.') // print usage
    process.exit(1)
  }
  let stream
  try {
    const { content } = await readDirStructure(source)
    stream = createDirStream(source, content)
  } catch (err) {
    const { code } = err
    if (code == 'ENOTDIR') {
      stream = createReadStream(source)
    } else {
      throw err
    }
  }
  await run(stream, output, toc)
}

(async () => {
  try {
    await doc(_source, _output, _toc)
  } catch ({ stack, message, code }) {
    if (code == 'ENOENT') {
      console.log('File %s does not exist', _source)
      process.exit(2)
    }
    DEBUG ? LOG(stack) : console.log(message)
  }
  // if (watch) {
  //   watchFile(source, async () => {
  //     await doRun()
  //   })
  // }
})()
