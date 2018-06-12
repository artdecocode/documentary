#!/usr/bin/env node
import argufy from 'argufy'
import { debuglog } from 'util'
import runToc from './toc'

const LOG = debuglog('doc')
const DEBUG = /doc/.test(process.env.NODE_DEBUG)

const {
  toc,
  replace,
  out,
} = argufy({
  toc: 't',
  replace: {
    short: 'r',
    boolean: true,
  },
  out: 'o',
}, process.argv)

;(async () => {
  try {
    if (toc) await runToc(toc, out, replace)
  } catch ({ stack, message }) {
    DEBUG ? LOG(stack) : console.log(message)
  }
})()
