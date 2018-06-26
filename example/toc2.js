import { Toc } from '../src'
import Catchment from 'catchment'
import { Readable } from 'stream'

const skipLevelOne = process.argv.some(a => a == '-s')

const s = `
# Hello World

## Table Of Contents

%TOC%

## Introduction

Description of the program goes here.
`

;(async () => {
  try {
    const md = new Readable({
      read() {
        this.push(s)
        this.push(null)
      },
    })
    const rs = new Toc({
      skipLevelOne,
    })
    md.pipe(rs)

    const { promise } = new Catchment({ rs })
    const res = await promise
    console.log(res)
  } catch ({ stack }) {
    console.log(stack)
  }
})()
