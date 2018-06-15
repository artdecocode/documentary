#!/usr/bin/env node
import argufy from 'argufy'
import { debuglog } from 'util'
import run from './run'

const LOG = debuglog('doc')
const DEBUG = /doc/.test(process.env.NODE_DEBUG)

const {
  source,
  output,
} = argufy({
  source: {
    command: true,
  },
  output: 'o',
}, process.argv)

;(async () => {
  try {
    await run(source, output)
  } catch ({ stack, message }) {
    DEBUG ? LOG(stack) : console.log(message)
  }
})()
