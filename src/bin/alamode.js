#!/usr/bin/env node
const { dirname } = require('path')
const alamode = require('alamode')
const preact = dirname(require.resolve('preact/package.json'))
alamode({
  pragma: `const { h } = require("${preact}");`,
})
require('.')
