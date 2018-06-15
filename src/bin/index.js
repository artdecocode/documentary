#!/usr/bin/env node
import { watchFile } from 'fs'
import argufy from 'argufy'
import { debuglog } from 'util'
import run from './run'

const LOG = debuglog('doc')
const DEBUG = /doc/.test(process.env.NODE_DEBUG)

const {
  source,
  output,
  toc,
  watch,
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
}, process.argv)

const doRun = async () => {
  try {
    await run(source, output, toc)
  } catch ({ stack, message }) {
    DEBUG ? LOG(stack) : console.log(message)
  }
}

(async () => {
  if (!source) {
    console.log('Please specify an input file.') // print usage
    process.exit(1)
  }
  await doRun()
  if (watch) {
    watchFile(source, async () => {
      await doRun()
    })
  }
})()
